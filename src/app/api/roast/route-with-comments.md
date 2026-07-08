// app/api/roast/route.ts
import { extractSiteContent } from "@/app/lib/extractSiteContent";
import { roastWebsite } from "@/app/lib/roastWithGemini";
import { normalizeUrl } from "@/app/lib/validateUrl";
import { assertPublicHostname } from "@/app/lib/assertSafeUrl.server";
import { ratelimit } from "@/app/lib/ratelimit";
import { redis } from "@/app/lib/redis";

/**
 * Checks Redis for a cached roast, and if there isn't one, checks whether
 * this IP has hit its rate limit.
 *
 * WHY THE RETURN TYPE LOOKS LIKE THIS:
 * This function can end in exactly 3 different states, and the caller
 * (POST, below) needs to know which one happened so it can react correctly:
 *
 *   1. { response: Response }  -> something failed (rate limited). POST should
 *                                 immediately return this Response to the client
 *                                 and do nothing else.
 *   2. { cached: unknown }     -> we found a cached roast. POST should send
 *                                 that cached data back, not do any more work.
 *   3. { ok: true }            -> everything's fine, no cache hit, not rate
 *                                 limited. POST should continue on to fetch
 *                                 the site and call Gemini.
 *
 * The `|` between the three object shapes is a TypeScript "union type" --
 * it means "this function returns ONE of these three shapes, but you won't
 * know which until you check at runtime." That's why every place that calls
 * this function has to check "which shape did I get back?" using `"key" in result`
 * before it can safely use it.
 */
async function checkCacheAndRateLimit(
  request: Request,
  cacheKey: string,
): Promise<{ response: Response } | { cached: unknown } | { ok: true }> {
  // Look up this URL in Redis first -- if someone already roasted it recently,
  // we can skip everything below (no rate limit check, no site fetch, no Gemini call).
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { cached };
  }

  // No cache hit -- this is a "real" new request, so it counts against the
  // rate limit. Grab the caller's IP from the header Vercel sets automatically.
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    // Too many requests from this IP recently -- build the 429 error response
    // and hand it back wrapped in { response: ... } so POST knows to return it as-is.
    return {
      response: Response.json(
        { error: "Too many requests. Try again later." },
        { status: 429 },
      ),
    };
  }

  // Not cached, and not rate limited -- green light to continue.
  return { ok: true };
}

/**
 * Fetches the target site's HTML.
 *
 * Same union-type pattern as above, but simpler -- only 2 possible outcomes:
 *   1. { response: Response } -> something went wrong (network error, or the
 *                                 site returned a non-2xx status). POST should
 *                                 return this Response immediately.
 *   2. { site: Response }     -> success! POST gets the actual fetch Response
 *                                 back so it can read the HTML out of it.
 */

const MAX_REDIRECTS = 3;

async function fetchSite(
  targetUrl: URL,
): Promise<{ response: Response } | { site: Response }> {
  let currentUrl = targetUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    let siteResponse: Response;

    try {
      siteResponse = await fetch(currentUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WebsiteRoasterBot/1.0)",
        },
        signal: AbortSignal.timeout(10_000),
        redirect: "manual", // don't let fetch follow redirects automatically
      });
    } catch {
      return {
        response: Response.json(
          { error: "Couldn't reach that site" },
          { status: 422 },
        ),
      };
    }

    // "manual" redirect mode gives you an opaque-redirect response for
    // same-origin-policy reasons in browsers, but in Node (route handlers
    // run server-side) you actually get status 3xx and a Location header.
    const isRedirect = siteResponse.status >= 300 && siteResponse.status < 400;

    if (isRedirect) {
      const location = siteResponse.headers.get("location");
      if (!location) {
        return {
          response: Response.json(
            { error: "Site returned a broken redirect" },
            { status: 422 },
          ),
        };
      }

      // Location can be relative -- resolve it against the current URL.
      let nextUrl: URL;
      try {
        nextUrl = new URL(location, currentUrl);
      } catch {
        return {
          response: Response.json(
            { error: "Site returned a broken redirect" },
            { status: 422 },
          ),
        };
      }

      // Re-run the SAME validation the original URL went through --
      // this is the whole point. A redirect target gets no free pass.
      const normalized = normalizeUrl(nextUrl.toString());
      if (!normalized) {
        return {
          response: Response.json(
            { error: "Redirect pointed to a disallowed URL" },
            { status: 422 },
          ),
        };
      }
      const revalidatedUrl = new URL(normalized);

      const safe = await assertPublicHostname(revalidatedUrl.hostname);
      if (!safe) {
        return {
          response: Response.json(
            { error: "Redirect pointed to a disallowed URL" },
            { status: 422 },
          ),
        };
      }

      currentUrl = revalidatedUrl;
      continue; // loop again, fetch the new target
    }

    if (!siteResponse.ok) {
      return {
        response: Response.json(
          { error: "Couldn't fetch that site" },
          { status: 422 },
        ),
      };
    }

    return { site: siteResponse };
  }

  // Looped MAX_REDIRECTS + 1 times and never got a non-redirect response
  return {
    response: Response.json({ error: "Too many redirects" }, { status: 422 }),
  };
}

export async function POST(request: Request) {
  // Parse the JSON body the client sent, e.g. { url: "https://example.com" }
  const { url } = await request.json();

  // --- STEP 1: cheapest possible check first ---
  // No network calls involved, so reject obviously bad input before
  // spending any time/money on it.
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Safe to parse now -- isValidUrl already proved this won't throw.
  const targetUrl = new URL(normalizedUrl);

  // --- NEW: DNS-resolution guard goes here, right after targetUrl exists ---
  const safe = await assertPublicHostname(targetUrl.hostname);
  if (!safe) {
    return Response.json(
      { error: "That URL can't be reached" },
      { status: 422 },
    );
  }

  // Build a cache key from hostname + pathname only (drops protocol and
  // query string), so "https://example.com/pricing" and
  // "http://example.com/pricing?ref=x" are treated as the same page.
  const cacheKey = `roast:${targetUrl.hostname}${targetUrl.pathname}`;

  // --- STEP 2: cache check + rate limit ---
  const cacheResult = await checkCacheAndRateLimit(request, cacheKey);

  // `"response" in cacheResult` is how we check WHICH shape of the union
  // we actually got back. If it has a `response` key, something failed
  // (rate limited) -- return that Response straight to the client and stop.
  if ("response" in cacheResult) return cacheResult.response;

  // If it has a `cached` key instead, we found a previous roast -- return
  // it immediately, skipping the site fetch and Gemini call entirely.
  if ("cached" in cacheResult)
    return Response.json({ roast: cacheResult.cached, cached: true });

  // If neither key was present, `cacheResult` must be `{ ok: true }` --
  // meaning: no cache hit, not rate limited, safe to continue below.

  // --- STEP 3: fetch the actual target site ---
  const fetchResult = await fetchSite(targetUrl);

  // Same union-checking pattern: if `fetchSite` failed, it already built
  // the right error Response for us -- just return it.
  if ("response" in fetchResult) return fetchResult.response;

  // Otherwise it succeeded, and `fetchResult.site` is the real fetch Response.
  const siteResponse = fetchResult.site;

  // --- STEP 4: make sure what we fetched is actually a webpage ---
  const contentType = siteResponse.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return Response.json(
      { error: "That URL doesn't point to a webpage" },
      { status: 422 },
    );
  }

  // --- STEP 5: pull the raw HTML out and extract the useful bits ---
  const html = await siteResponse.text();
  const siteContent = extractSiteContent(html);

  // --- STEP 6: send it to Gemini and get the roast back ---
  let roast;
  try {
    roast = await roastWebsite(siteContent, targetUrl.toString());
  } catch {
    // Gemini might be down, rate-limited on our end, or return something
    // that fails to parse -- catch all of that here rather than crashing.
    return Response.json(
      { error: "Something went wrong generating your roast. Try again." },
      { status: 502 },
    );
  }

  // --- STEP 7: cache the fresh result for next time, then respond ---
  // 60 * 60 * 24 = 86,400 seconds = 24 hours before this entry auto-expires.
  await redis.set(cacheKey, roast, { ex: 60 * 60 * 24 });

  return Response.json({ roast, cached: false });
}
