import type { FAQEntry } from "./types";

export const howItWorksEntries: FAQEntry[] = [
  {
    id: "how-scoring-works",
    question: "How does the scoring work?",
    answer:
      "Five categories — clarity, copy, CTA, trust, mobile. I read your DOM, judge your life choices, hand you a number.",
    category: "how-it-works",
    followUpIds: ["why-different-scores"],
  },
  {
    id: "why-different-scores",
    question:
      "Why did I get a different score when I roasted the same site twice?",
    answer:
      "A point or two of swing is normal — I'm judgment, not a calculator. Bigger swing than that? Your site's just borderline. I'm not broken.",
    category: "how-it-works",
    followUpIds: ["is-score-random", "how-to-get-fair-score"],
  },
  {
    id: "is-score-random",
    question: "Is the scoring completely random then?",
    answer:
      "Random means a 2 turns into a 9. Never happens. What you're seeing is drift, not chaos.",
    category: "how-it-works",
  },
  {
    id: "how-to-get-fair-score",
    question: "How do I get the most accurate score?",
    answer:
      "Roast it once, read the reasoning, not just the number. The breakdown tells you more than the digit ever will. If you're chasing a specific score, you're missing the point of this thing entirely.",
    category: "how-it-works",
  },
  {
    id: "what-if-good-site",
    question: "What if my site is actually good?",
    answer: "Then I'll say so. Reluctantly. I'm mean, not dishonest.",
    category: "how-it-works",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "does-it-work-any-site",
    question: "Can you roast any website?",
    answer:
      "Any public one, yeah. Password-protected sites and localhost, no — I can't roast what I can't see.",
    category: "how-it-works",
  },
  {
    id: "how-long-does-it-take",
    question: "How long does a roast take?",
    answer:
      "A few seconds to read your site, a few more to judge it properly. If it's hanging longer than that, the site's fighting me or traffic's heavy — not that I've given up.",
    category: "how-it-works",
    typingDelayMs: [1000, 2500],
  },
  {
    id: "why-cant-roast-anymore",
    question: "Why can't I roast anymore?",
    answer:
      "Two options: you've hit the 5-roasts-per-hour limit, or I'm just busy roasting someone else's site right now. Either way, give it a bit and try again.",
    category: "how-it-works",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "whats-the-dropdown",
    question: "What's that dropdown with past roasts?",
    answer:
      "Sites I've already torn apart — yours and other people's. Faster than making me do the same site twice.",
    category: "how-it-works",
  },
];
