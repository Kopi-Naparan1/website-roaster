// app/api/roast/route.ts
import { extractSiteContent } from "@/app/lib/extractSiteContent";
import { roastWebsite } from "@/app/lib/roastWithGemini";
import { normalizeUrl } from "@/app/lib/validateUrl";
import { resolvePublicIp } from "@/app/lib/assertSafeUrl.server";
import { ratelimit } from "@/app/lib/ratelimit";
import { redis } from "@/app/lib/redis";
import { fetchPinned } from "@/app/lib/safeFetch";
import { urlToSlug } from "@/app/lib/slug";
import { RoastDataType } from "@/app/roast/RoastBreakDown";

async function checkCacheAndRateLimit(
  request: Request,
  cacheKey: string,
): Promise<{ response: Response } | { cached: unknown } | { ok: true }> {
  // Checking if there is a record in the DB through cache ket, if there is, return that cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { cached };
  }

  // This gets the orignal users' IP to check for rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return {
      response: Response.json(
        { error: "Too many requests. Try again later." },
        { status: 429 },
      ),
    };
  }

  return { ok: true };
}

const MAX_REDIRECTS = 3;

async function fetchSite(
  targetUrl: URL,
): Promise<{ response: Response } | { site: Response }> {
  const currentUrl = targetUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    // If the IP holds true, then it will be used.
    const pinnedIp = await resolvePublicIp(currentUrl.hostname);

    if (!pinnedIp) {
      return {
        response: Response.json(
          { error: "That URL can't be reached" },
          { status: 422 },
        ),
      };
    }

    let siteResponse: Response;

    try {
      siteResponse = await fetchPinned(currentUrl, pinnedIp, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WebsiteRoasterBot/1.0)",
        },
        signal: AbortSignal.timeout(10_000),
        redirect: "manual", // note: check undici support, see below
      });
    } catch {
      return {
        response: Response.json(
          { error: "Couldn't reach that site" },
          { status: 422 },
        ),
      };
    }

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

      const normalized = normalizeUrl(nextUrl.toString());
      if (!normalized) {
        return {
          response: Response.json(
            { error: "Redirect pointed to a disallowed URL" },
            { status: 422 },
          ),
        };
      }
    }

    if (!siteResponse.ok) {
      return {
        response: Response.json(
          { error: "Couldn't fetch this site" },
          { status: 422 },
        ),
      };
    }

    return { site: siteResponse };
  }

  return {
    response: Response.json({ error: "Too many redirects" }, { status: 422 }),
  };
}

export async function POST(request: Request) {
  // Parse the JSON body the client sent, e.g. { url: "https://example.com" }
  const { url } = await request.json();

  // --- STEP 1: SANITIZATION OF URL---
  // cheapest possible check first
  // No network calls involved, so reject obviously bad input before
  // spending any time/money on it.
  // Second check the URL (server side)
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const targetUrl = new URL(normalizedUrl);
  const slug = urlToSlug(targetUrl.hostname, targetUrl.pathname);

  const safe = await resolvePublicIp(targetUrl.hostname);
  if (!safe) {
    return Response.json(
      { error: "That URL can't be reached" },
      { status: 422 },
    );
  }

  const cacheKey = `roast:${targetUrl.hostname}${targetUrl.pathname}`;

  // --- STEP 2: RATE LIMIT OF IP & CACHE CHECK OF URL ---
  // cache check + rate limit
  const cacheResult = await checkCacheAndRateLimit(request, cacheKey);
  if ("response" in cacheResult) return cacheResult.response;
  if ("cached" in cacheResult) {
    const { roast, url } = cacheResult.cached as {
      roast: RoastDataType;
      url: string;
    };
    return Response.json({ roast, url, cached: true, slug });
  }
  const startTime = Date.now();
  // --- STEP 3: IF GOOD: RATELIMIT AND NO CACHE ---
  // fetch the actual target site

  const fetchStart = Date.now();
  const fetchResult = await fetchSite(targetUrl);
  const fetchDuration = Date.now() - fetchStart;

  if ("response" in fetchResult) return fetchResult.response;
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
  const roastStart = Date.now();
  let roast;
  console.time("roastWebsite");
  try {
    roast = await roastWebsite(siteContent, targetUrl.toString());
  } catch {
    return Response.json(
      { error: "Something went wrong generating your roast. Try again." },
      { status: 502 },
    );
  }
  const roastDuration = Date.now() - roastStart;
  const totalDuration = Date.now() - startTime;
  console.log(
    `fetch: ${fetchDuration}ms, roast: ${roastDuration}ms, total: ${totalDuration}ms`,
  );
  // --- STEP 7: cache the fresh result for next time, then respond ---
  // 60 * 60 * 24 = 86,400 seconds = 24 hours before this entry auto-expires.
  await redis.set(
    cacheKey,
    { roast, url: targetUrl.toString() },
    { ex: 60 * 60 * 24 },
  );

  return Response.json({
    roast,
    cached: false,
    timing: { fetchDuration, roastDuration, totalDuration },
    slug,
  });
}
