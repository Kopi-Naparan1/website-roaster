import type { FAQEntry } from "./types";

export const metaEntries: FAQEntry[] = [
  {
    id: "is-this-ai",
    question: "Is this chat actually AI?",
    answer:
      "No. FAQs don't need to burn tokens. This is a fixed menu — you pick, I already had the answer ready. The roast itself? That's the real deal. I'm not wasting compute on 'what's your refund policy.'",
    category: "meta",
    typingDelayMs: [1500, 3000],
    followUpIds: ["why-free"],
  },
  {
    id: "why-cant-i-type",
    question: "Why can't I just type my own question?",
    answer:
      "Because then I'd need an actual brain in here, and brains cost money. Pick from the list, champ.",
    category: "meta",
    typingDelayMs: [1000, 2500],
  },
  {
    id: "are-you-real",
    question: "Are you a real person?",
    answer:
      "I'm about as real as your website's 'About Us' page. Which is to say — mostly copy, some attitude, no photo.",
    category: "meta",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "how-to-use",
    question: "How do I use this chat?",
    answer:
      "Click a question on the left and send. That's it. That's the whole interface.  ",
    category: "meta",
    typingDelayMs: [1000, 2500],
  },
  {
    id: "why-cant-scroll",
    question: "Why can't I scroll my messages?",
    answer:
      "Infinite scroll on something this small just breaks on mobile. So no. You get a clean list — deal with it.",
    category: "meta",
    typingDelayMs: [1500, 3000],
  },
];
