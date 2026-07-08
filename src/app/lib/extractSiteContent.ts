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
}

export function extractSiteContent(html: string): ExtractedSite {
  const $ = cheerio.load(html);

  // Strip noise before extracting anything else
  $("script, style, noscript, svg, link[rel='stylesheet']").remove();

  const title = $("title").first().text().trim();
  const metaDescription =
    $("meta[name='description']").attr("content")?.trim() ?? "";

  // Clarity: heading structure tells you if the page has a clear hierarchy
  const headings: { tag: string; text: string }[] = [];
  $("h1, h2, h3").each((_, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text) headings.push({ tag, text });
  });

  // Copy: general readable body text, capped so you don't blow your token budget
  const bodyText = $("body")
    .clone()
    .find("nav, header, footer, script, style")
    .remove()
    .end()
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000); // cap — Gemini doesn't need the whole page verbatim

  // CTA: buttons, links styled/behaving like buttons, and submit inputs
  const ctaTexts: string[] = [];
  $("button, a[class*='btn'], a[class*='button'], input[type='submit']").each(
    (_, el) => {
      const text = $(el).text().trim() || $(el).attr("value")?.trim();
      if (text) ctaTexts.push(text);
    },
  );

  // Trust: nav often reveals trust signals (About, Contact, Privacy, Terms)
  const navLinks: string[] = [];
  $("nav a, header a").each((_, el) => {
    const text = $(el).text().trim();
    if (text) navLinks.push(text);
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
  };
}
