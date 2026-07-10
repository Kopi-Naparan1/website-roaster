import { GoogleGenAI } from "@google/genai";
import type { ExtractedSite } from "./extractSiteContent";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const categorySchema = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 1, maximum: 10 },
    comment: { type: "string" },
    evidence: { type: "string" },
    strength: { type: "string" },
    tip: { type: "string" },
    quote: { type: "string" },
  },
  required: ["score", "comment", "evidence", "strength", "tip", "quote"],
};

const roastSchema = {
  type: "object",
  properties: {
    clarity: categorySchema,
    copy: categorySchema,
    cta: categorySchema,
    trust: categorySchema,
    mobile: categorySchema,
    overall: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        tier: {
          type: "string",
          enum: ["Needs Work", "Getting There", "Solid", "Impressive"],
        },
        comment: { type: "string" },
        evidence: { type: "string" },
        strength: { type: "string" },
        tip: { type: "string" },
        topPriority: { type: "string" },
        quote: { type: "string" },
      },
      required: [
        "score",
        "tier",
        "comment",
        "evidence",
        "strength",
        "tip",
        "topPriority",
        "quote",
      ],
    },
  },
  required: ["clarity", "copy", "cta", "trust", "mobile", "overall"],
};

const today = new Date().toISOString().split("T")[0];

export async function roastWebsite(siteContent: ExtractedSite, url: string) {
  const prompt = `
You are a brutally honest, witty website critic — think a mix of a senior UX
consultant and a stand-up comedian roasting a friend. Analyze the website
content extracted from ${url} and score it 1-10 on each category below.

TODAY'S DATE IS ${today}. Use this as the reference point for any dates found
in the content (testimonials, copyright years, etc). Only flag a date as
suspicious if it is genuinely after ${today} — do not assume any past date
is an error.

RULES:
- Only reference details that actually appear in the content below. Never
  invent features, competitors, stats, or claims not present in the data.
- Roast the website and its choices, never the people who made it. Nothing
  that reads as a personal insult — stay product-focused.
- For "trust": critique observable credibility signals only (missing contact
  info, no social proof, dated design cues). Never accuse the site or its
  owners of being a scam or illegitimate.
- Be harsh but fair. This is entertainment, so be punchy and quotable — but
  every roast must cite a real, specific detail. No vague generic jokes.
- Every category must include one genuine strength, even a low-scoring one.
  Real critics build trust by acknowledging what works, not just attacking.

For each of the 5 categories (clarity, copy, cta, trust, mobile), return:
- "comment": the roast. 1-2 punchy sentences, specific to this site.
- "evidence": the exact detail justifying the roast (quote a heading, CTA,
  or describe what's missing).
- "strength": one real thing this category does well, however small.
- "tip": one concrete, actionable fix — plain and useful, no jokes.
- "quote": a single sub-15-word line, sharable on social media.

For "overall", return all of the above PLUS:
- "tier": one of "Needs Work", "Getting There", "Solid", "Impressive" —
  a plain-language summary judgment.
- "topPriority": if this site fixes exactly ONE thing, what should it be
  and why does it matter most? This is the single highest-leverage fix.

EXAMPLE OF THE QUALITY BAR (for a hypothetical site, do not reuse this content):
{
  "clarity": {
    "score": 3,
    "comment": "Your hero says 'Empowering Tomorrow's Solutions Today' — that's not a value proposition, that's a fortune cookie.",
    "evidence": "H1 reads 'Empowering Tomorrow's Solutions Today' with no subheading explaining what the company actually sells.",
    "strength": "The logo and nav are clean and load fast, so the confusion isn't a technical problem.",
    "tip": "Replace the H1 with a single sentence naming what you do and who it's for, e.g. 'Project management software for freelance designers.'",
    "quote": "Fortune cookies have more clarity than this hero section."
  }
}
Notice: the roast is specific (quotes the actual text), the strength is real
(not empty praise), and the tip is something the site owner could apply today.

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
      temperature: 0.9,
    },
  });

  if (!response.text) {
    const reason = response.candidates?.[0]?.finishReason ?? "unknown";
    throw new Error(`Gemini returned no text (finishReason: ${reason})`);
  }

  return JSON.parse(response.text);
}
