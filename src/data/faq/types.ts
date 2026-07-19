export type FAQCategory =
  | "meta"
  | "about-vex"
  | "vex-story"
  | "how-it-works"
  | "trust-privacy"
  | "monetization";

export type FAQEntry = {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  typingDelayMs?: [number, number];
  followUpIds?: string[];
  tags?: string[];
};

export const DEFAULT_TYPING_DELAY_MS: [number, number] = [2000, 5000];
