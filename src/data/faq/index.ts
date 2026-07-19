import { metaEntries } from "./meta";
import { aboutVexEntries } from "./aboutVex";
import { vexStoryEntries } from "./vexStory";
import { howItWorksEntries } from "./howItWorks";
import { trustPrivacyEntries } from "./trustPrivacy";
import { monetizationEntries } from "./monetization";
import type { FAQCategory, FAQEntry } from "./types";

export type { FAQCategory, FAQEntry };
export { DEFAULT_TYPING_DELAY_MS } from "./types";

export const faqData: FAQEntry[] = [
  ...metaEntries,
  ...aboutVexEntries,
  ...vexStoryEntries,
  ...howItWorksEntries,
  ...trustPrivacyEntries,
  ...monetizationEntries,
];

export const faqById: Record<string, FAQEntry> = Object.fromEntries(
  faqData.map((entry) => [entry.id, entry]),
);

export const faqByCategory: Record<FAQCategory, FAQEntry[]> = faqData.reduce(
  (acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  },
  {} as Record<FAQCategory, FAQEntry[]>,
);
