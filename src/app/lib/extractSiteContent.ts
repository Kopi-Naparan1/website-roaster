// app/lib/extractSiteContent.ts
import * as cheerio from "cheerio";

export interface ExtractedSite {
  title: string;
  metaDescription: string;
  headings: { tag: string; text: string }[];
  bodyText: string;
  ctaTexts: string[];
  navLinks: string[];
  imageAltTexts: string[];
  imageCount: number;
  imagesWithoutAlt: number;
  hasViewportMeta: boolean;
  wordCount: number;
  detectedDates: string[]; // new
}

export function extractSiteContent(html: string): ExtractedSite {
  const $ = cheerio.load(html);

  // Strip noise before extracting anything else
  $("script, style, noscript, svg, link[rel='stylesheet']").remove();

  // Insert a space after every element so adjacent tags don't get their
  // text mashed together when we later call .text() (e.g. "Home" + "Works"
  // becoming "HomeWorks" instead of "Home Works").
  $("body")
    .find("*")
    .each((_, el) => {
      $(el).after(" ");
    });

  const title = $("title").first().text().trim();
  const metaDescription =
    $("meta[name='description']").attr("content")?.trim() ?? "";

  const headings: { tag: string; text: string }[] = [];
  const seenHeadings = new Set<string>();
  $("h1, h2, h3").each((_, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";
    const text = $(el).text().trim().replace(/\s+/g, " ");
    const key = `${tag}:${text}`;
    if (text && !seenHeadings.has(key)) {
      seenHeadings.add(key);
      headings.push({ tag, text });
    }
  });

  // Dates: catches "January 23, 2026", "23 Jan 2026", "2026-01-23", "01/23/2026"
  const DATE_PATTERN =
    /\b(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})\b/gi;

  const rawText = $("body").text();
  const detectedDates = Array.from(new Set(rawText.match(DATE_PATTERN) ?? []));

  const bodyText = $("body")
    .clone()
    .find("nav, header, footer, script, style")
    .remove()
    .end()
    .find("[class*='md:hidden'], [class*='lg:hidden'], [aria-hidden='true']")
    .remove() // strip the responsive-duplicate copy, keep one version
    .end()
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  // CTA: buttons, links styled/behaving like buttons, and submit inputs
  const ctaTexts: string[] = [];
  const seenCtaTexts = new Set<string>();
  $("button, a[class*='btn'], a[class*='button'], input[type='submit']").each(
    (_, el) => {
      const text = $(el).text().trim() || $(el).attr("value")?.trim();
      if (text && !seenCtaTexts.has(text)) {
        seenCtaTexts.add(text);
        ctaTexts.push(text);
      }
    },
  );

  // Trust: nav often reveals trust signals (About, Contact, Privacy, Terms)
  // De-duplicated: many sites render both a desktop and a hidden mobile nav,
  // and Cheerio can't see CSS `display: none`, so it reads both copies.
  const navLinks: string[] = [];
  const seenNavLinks = new Set<string>();
  $("nav a, header a").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !seenNavLinks.has(text)) {
      seenNavLinks.add(text);
      navLinks.push(text);
    }
  });

  // Mobile: can't fully test responsiveness server-side without a headless browser,
  // but the viewport meta tag is a strong, cheap signal
  const hasViewportMeta = $("meta[name='viewport']").length > 0;

  // Images: alt text coverage is both an accessibility AND a trust/quality signal
  const imageAltTexts: string[] = [];
  let imagesWithoutAlt = 0;
  $("img").each((_, el) => {
    const alt = $(el).attr("alt")?.trim();
    if (alt) imageAltTexts.push(alt);
    else imagesWithoutAlt++;
  });

  return {
    title,
    metaDescription,
    headings,
    bodyText,
    ctaTexts,
    navLinks,
    imageAltTexts,
    imageCount: $("img").length,
    imagesWithoutAlt,
    hasViewportMeta,
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    detectedDates,
  };
}
