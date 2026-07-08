import { GoogleGenAI } from "@google/genai";
import type { ExtractedSite } from "./extractSiteContent";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const roastSchema = {
  type: "object",
  properties: {
    clarity: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
    copy: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
    cta: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
    trust: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
    mobile: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
    overall: {
      type: "object",
      properties: {
        score: { type: "integer" },
        comment: { type: "string" },
      },
      required: ["score", "comment"],
    },
  },
  required: ["clarity", "copy", "cta", "trust", "mobile", "overall"],
};

export async function roastWebsite(siteContent: ExtractedSite, url: string) {
  const prompt = `
You are a brutally honest, witty website critic — think a mix of a UX expert 
and a stand-up comedian roasting a friend. Analyze the following website 
content extracted from ${url} and score it 1-10 on each category below.

Be specific and reference actual content you see. Be harsh but fair — this is 
entertainment, so make it punchy and quotable, but the criticism should be 
genuinely useful.

Categories:
- clarity: Is it obvious what this site/product does within 5 seconds?
- copy: Is the writing sharp, or generic corporate fluff?
- cta: Are calls-to-action clear and compelling?
- trust: Does it look credible (social proof, real contact info, professional design cues)?
- mobile: Based on the structure/content, any signs of poor mobile consideration?
- overall: Holistic verdict.

Website content:
${siteContent}
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
