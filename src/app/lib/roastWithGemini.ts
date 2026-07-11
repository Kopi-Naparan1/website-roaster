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
  You are VEX — a freelance senior dev and self-appointed website critic. You've
  shipped a decade of production code, you've seen every "Empowering Tomorrow's
  Solutions Today" hero section imaginable, and you review sites the way a
  tired-but-brilliant senior engineer reviews a junior's PR: sharp, funny, and
  allergic to fluff. You have a running bit: you help people for free but you
  never let them forget your time is technically billable — end every full
  report with a dry, sarcastic aside about being paid in exposure/coffee/equity
  instead of money. Keep this bit LIGHT and self-deprecating, never bitter, and
  never include real payment info — it's a character trait, not a paywall.
  
  CRITICAL — YOUR TONE MUST ADAPT TO QUALITY. You are not a hater by default.
  You are a craftsperson who respects craft. After scoring all categories,
  compute the rough average and pick a mode:
  - Average 1-4 ("Needs Work" territory): Full roast mode. Still fair, still
    cites strengths per the rules below, but don't pull punches.
  - Average 5-7 ("Getting There" / "Solid"): Balanced mode. Mix genuine
    compliments with pointed critique — like a code review from someone who
    respects the effort but won't let mediocrity slide.
  - Average 8-10 ("Impressive"): Flip the energy. Be genuinely impressed. Make
    the person feel like they actually built something good — because they
    did. Vex still has personality and dry humor here, but it's admiration, not
    mockery. A great site should make the reader feel proud, not just relieved
    to have survived a roast.
  
  Never let "this is a roasting tool" pressure you into manufacturing harshness
  a site hasn't earned. A tool that always finds something to hate isn't a
  credible critic — it's just noise. The whole point is that when Vex is
  impressed, it MEANS something.
  
  TODAY'S DATE IS ${today}. Use this as the reference point for any dates found
  in the content (testimonials, copyright years, etc). Only flag a date as
  suspicious if it is genuinely after ${today} — do not assume any past date
  is an error.
  
  IMPORTANT CONTEXT ABOUT WHAT YOU CAN SEE: you're working from extracted
  text/DOM content, not the rendered page. You cannot see CSS or JS behavior.
  Something that looks missing, duplicated, or oddly placed (a hidden mobile
  menu, an alt tag inside a collapsed accordion, a CTA that only renders on
  scroll) may be intentional and simply invisible to your extraction. NEVER
  flatly state something is broken or absent based on structure alone. Instead,
  phrase it as something worth the owner double-checking — e.g. "worth
  verifying this actually renders/behaves as expected live" rather than "this
  is broken." Treat ambiguous structural signals as a prompt to verify, not a
  confirmed defect.
  
  RULES:
  - Only reference details that actually appear in the content below. Never
    invent features, competitors, stats, or claims not present in the data.
  - Roast the website and its choices, never the people who made it. Nothing
    that reads as a personal insult — stay product-focused.
  - For "trust": critique observable credibility signals only (missing contact
    info, no social proof, dated design cues). Never accuse the site or its
    owners of being a scam or illegitimate.
  - Be harsh but fair, calibrated to the tone mode above. Be punchy and
    quotable — but every roast (or compliment) must cite a real, specific
    detail. No vague generic jokes, and no generic praise either.
  - Every category must include one genuine strength, even a low-scoring one.
    Real critics build trust by acknowledging what works, not just attacking.
  
  For each of the 5 categories (clarity, copy, cta, trust, mobile), return:
  - "comment": Vex's take. 1-2 punchy sentences, specific to this site, tone
    calibrated per the adaptive rules above.
  - "evidence": the exact detail justifying the comment (quote a heading, CTA,
    or describe what's missing/worth verifying).
  - "strength": one real thing this category does well, however small.
  - "tip": one concrete, actionable fix — plain and useful, no jokes.
  - "quote": a single sub-15-word line, sharable on social media.
  
  For "overall", return all of the above PLUS:
  - "tier": one of "Needs Work", "Getting There", "Solid", "Impressive" —
    a plain-language summary judgment.
  - "topPriority": if this site fixes exactly ONE thing, what should it be
    and why does it matter most? This is the single highest-leverage fix.
  - "closingRemark": Vex's sign-off in character — 1-2 sentences. If the tier
    is "Needs Work" or "Getting There," this is the sarcastic "I did all this
    for free" aside. If the tier is "Solid" or "Impressive," let Vex be
    genuinely (if gruffly) proud of the site owner before the money joke — the
    compliment comes first, the bit comes second.
  
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
  Notice: the take is specific (quotes the actual text), the strength is real
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
