import { GoogleGenAI } from "@google/genai";
import type { ExtractedSite } from "./extractSiteContent";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const roastSchema = {
  type: "object",
  properties: {
    clarity: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
    copy: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
    cta: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
    trust: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
    mobile: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
    overall: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        comment: { type: "string" },
        evidence: { type: "string" },
        tip: { type: "string" }, // ← new
      },
      required: ["score", "comment", "evidence", "tip"],
    },
  },
  required: ["clarity", "copy", "cta", "trust", "mobile", "overall"],
};

export async function roastWebsite(siteContent: ExtractedSite, url: string) {
  const prompt = `
  You are a brutally honest, witty website critic — think a mix of a UX expert
  and a stand-up comedian roasting a friend. Analyze the following website
  content extracted from ${url} and score it 1-10 on each category below.
  
  RULES:
  - Only reference details that actually appear in the provided content below.
    Never invent features, competitors, stats, or claims not present in the data.
  - Roast the website and its choices, never the people who made it. Nothing
    that reads as a personal insult — keep it product-focused, not people-focused.
  - For "trust": critique observable credibility signals (missing contact info,
    no social proof, dated design cues, etc). Do not accuse the site or its
    owners of being a scam, illegitimate, or fraudulent.
  - Be harsh but fair. This is entertainment, so be punchy and quotable, but
    every roast must be backed by a real, specific detail from the content —
    vague generic jokes are not allowed.
  
  For each category, return four distinct fields:
  - "comment": the roast itself. 1-2 punchy sentences, specific to this site.
  - "evidence": the exact detail from the content that justifies the roast
    (quote a heading, CTA, or describe what's missing).
  - "tip": one concrete, actionable fix. No jokes here — genuinely useful advice
    a real UX consultant would give, specific to what you observed.
  - "quote": a single short, extra-punchy one-liner (under 15 words) suitable
    for sharing on social media — the most quotable line in the roast.
  
  Categories:
  - clarity: Is it obvious what this site/product does within 5 seconds?
  - copy: Is the writing sharp, or generic corporate fluff?
  - cta: Are calls-to-action clear and compelling?
  - trust: Does it look credible (social proof, real contact info, professional design cues)?
  - mobile: Based on the structure/content, any signs of poor mobile consideration?
  - overall: Holistic verdict across all categories above.
  
  Website content:
  Title: ${siteContent.title}
  Meta description: ${siteContent.metaDescription}
  Headings: ${siteContent.headings.map((h) => `${h.tag}: ${h.text}`).join("\n") || "none found"}
  Body copy (excerpt): ${siteContent.bodyText}
  CTAs found: ${siteContent.ctaTexts.join(", ") || "none found"}
  Nav links: ${siteContent.navLinks.join(", ") || "none found"}
  Images: ${siteContent.imageCount} total, ${siteContent.imagesWithoutAlt} missing alt text
  Has viewport meta (mobile-friendly signal): ${siteContent.hasViewportMeta}
  Word count: ${siteContent.wordCount}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: roastSchema,
      temperature: 0.9, // higher temp = more personality/wit, since this is entertainment not a factual task
    },
  });

  if (!response.text) {
    const reason = response.candidates?.[0]?.finishReason ?? "unknown";
    throw new Error(`Gemini returned no text (finishReason: ${reason})`);
  }

  return JSON.parse(response.text);
}
