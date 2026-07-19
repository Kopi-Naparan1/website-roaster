import type { FAQEntry } from "./types";

export const monetizationEntries: FAQEntry[] = [
  {
    id: "why-free",
    question: "Why is this free?",
    answer:
      "Because I'm still earning your trust. Tip jar's coming once I've proven I'm worth it.",
    category: "monetization",
    followUpIds: ["how-to-donate"],
  },
  {
    id: "how-to-donate",
    question: "I really want to support the project, how do I donate?",
    answer:
      // TODO: once the tip jar is live, swap this for the real PayPal / GCash link/handle.
      "Not officially live yet — but when the tip jar drops, expect a PayPal and GCash link right here. Until then, my payment is your website getting better. That's it. That's the invoice.",
    category: "monetization",
  },
  {
    id: "can-i-pay-to-unlock-chapters",
    question: "If I tip, do I get chapters faster?",
    answer:
      "No. The story unlocks by roasting, not paying — I'm not selling the plot. Tip because you want to, not because you're trying to skip ahead.",
    category: "monetization",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "future-plans",
    question: "Will there be paid features?",
    answer: "Eventually. For now, enjoy the free humiliation.",
    category: "monetization",
    typingDelayMs: [1500, 3000],
    followUpIds: ["how-to-donate"],
  },
  {
    id: "refund-policy",
    question: "What's your refund policy?",
    answer:
      "Refund policy? This is free. You can't refund a compliment you never bought, dumbass.",
    category: "monetization",
    typingDelayMs: [1000, 2500],
  },
];
