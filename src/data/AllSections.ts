import { RoastDataType } from "@/app/roast/RoastBreakDown";

export interface AllSectionDataInterface {
  sectionType: string;
  heading: string;
  subHeading?: string;
  headingUrl?: string;
  roast?: RoastDataType;
  shareId?: string;
  isResultPage?: boolean;
}

export const AllSectionData: AllSectionDataInterface[] = [
  {
    sectionType: "hero",
    heading: "Your website has problems. Vex quit his job over less.",
    subHeading:
      "Paste your URL. Get a senior dev's honest, specific feedback in 30 seconds — no fluff, no 'make it pop,' no stock handshake photos. He works for free now. He'll mention that a lot.",
  },
  {
    sectionType: "examples",
    heading: "See what Vex is capable of",
    subHeading:
      "Real sites, real scores — he's rough on fortune-cookie headlines, generous when you've actually earned it.",
  },
  {
    sectionType: "roastBreakDown",
    heading: "Here's how Vex graded this site",
    subHeading:
      "Five categories. He used to sit in these meetings. Now he runs them.",
  },
  {
    sectionType: "questionsYouMightAsk",
    heading: "Vex Answers, Reluctantly",
    subHeading: "He's not always right. He'll tell you when he isn't.",
  },
  {
    sectionType: "overviewResultPage",
    heading: "Vex's Verdict",
    subHeading:
      "Your overall score — the number he'll bring up if you ever cross him.",
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
      "Got a friend's site in mind? Paste it below. He works for exposure, and exposure doesn't pay for lunch.",
  },
  {
    sectionType: "expiredID",
    heading: "Expired ID",
    subHeading:
      "This roast has expired. Try roasting it again to view the updated roast.",
  },
  {
    sectionType: "about",
    heading: "Who's Vex?",
    subHeading:
      "A senior dev who got laid off, got bitter, and got an API key.",
  },
];
