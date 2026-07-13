// data/SharedSectionOverrides.ts
import type { AllSectionDataInterface } from "./AllSections";

type Override = Pick<AllSectionDataInterface, "heading" | "subHeading">;

export const SharedSectionOverrides: Partial<Record<string, Override>> = {
  overviewResultPage: {
    heading: "Vex Already Roasted This One",
    subHeading: "Someone brave shared their score. Here's the damage.",
  },
  reroast: {
    heading: "Think you'd score higher?",
    subHeading: "Paste your own site. Vex is still working for free.",
  },
  roastBreakDown: {
    heading: "Here's how Vex grades this site",
  },
};
