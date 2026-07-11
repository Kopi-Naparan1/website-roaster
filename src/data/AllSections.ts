import { RoastDataType } from "@/app/roast/RoastBreakDown";

export interface AllSectionDataInterface {
  sectionType: string;
  heading: string;
  subHeading?: string;
  headingUrl?: string;
  roast?: RoastDataType;
  shareId?: string;
}

export const AllSectionData: AllSectionDataInterface[] = [
  {
    sectionType: "hero",
    heading: "Your website has problems. Vex will find them.",
    subHeading:
      "Paste your URL. Get a senior dev's honest, specific feedback in 30 seconds — no fluff, no 'just make it pop.' He works for free. He'll mention that a lot.",
  },
  {
    sectionType: "examples",
    heading: "See what Vex is capable of",
    subHeading:
      "Real sites, real scores, zero sugarcoating — sometimes zero mercy.",
  },
  {
    sectionType: "roastBreakDown",
    heading: "Here's how Vex grades you",
    subHeading: "Five categories. No participation trophies.",
  },
  {
    sectionType: "overviewResultPage",
    heading: "Vex's Verdict",
    subHeading:
      "Your overall score — the number he'll bring up if you ever cross him.",
  },
  {
    sectionType: "clarity",
    heading: "Clarity",
    subHeading: "Does anyone know what you do in the first 5 seconds?",
  },
  {
    sectionType: "copy",
    heading: "Copy",
    subHeading: "Clear and benefit-focused, or just jargon?",
  },
  {
    sectionType: "trust",
    heading: "Trust",
    subHeading: "Would a stranger actually believe you?",
  },
  {
    sectionType: "mobile",
    heading: "Mobile",
    subHeading: "Does it hold up on a phone, or fall apart?",
  },
  {
    sectionType: "share",
    heading: "Share your roast",
    subHeading:
      " Vex likes an audience — and it's still cheaper than his hourly rate.",
  },
  {
    sectionType: "reroast",
    heading: "Feed Vex another one",
    subHeading:
      "Got a friend's site in mind? Paste it below. He hasn't had lunch.",
  },
  {
    sectionType: "expiredID",
    heading: "Expired ID",
    subHeading:
      "This roast has expired. Try roasting it again to view the updated roast.",
  },
];
