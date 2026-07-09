import { RoastDataType } from "@/app/roast/RoastBreakDown";

export interface AllSectionDataInterface {
  sectionType: string;
  heading: string;
  subHeading: string;
  roast?: RoastDataType;
}

export const AllSectionData: AllSectionDataInterface[] = [
  {
    sectionType: "hero",
    heading: "Your website has problems. Let's find them.",
    subHeading:
      "Paste your URL. Get a senior designer's honest, specific feedback in 30 seconds — no fluff, no 'just make it pop.'",
  },
  {
    sectionType: "examples",
    heading: "See what a roast looks like",
    subHeading: "Real sites, real scores, zero sugarcoating.",
  },
  {
    sectionType: "overview",
    heading: "The Verdict",
    subHeading: "Your overall score, at a glance.",
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
    subHeading: "Share it. Let your friends' website get roasted too.",
  },
  {
    sectionType: "reroast",
    heading: "Roast another website",
    subHeading:
      "Got a friend's site in mind? Paste it below and watch it squirm.",
  },
];
