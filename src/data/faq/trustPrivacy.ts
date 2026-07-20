import type { FAQEntry } from "./types";

export const trustPrivacyEntries: FAQEntry[] = [
  {
    id: "what-do-you-store",
    question: "Do you store my website data?",
    answer:
      "Just enough to generate your roast and let you share the link. I'm not building a dossier on your homepage.",
    category: "trust-privacy",
    followUpIds: ["what-data-seriously"],
  },
  {
    id: "what-data-seriously",
    question: "Seriously, what data do you store?",
    answer:
      "Fair question, no bit this time. When you roast a site, I scrape its public DOM content, run it through the model, and store the resulting roast — score, breakdown, quote — tied to a slug so you can share the link. That's it. No accounts, no login, no tracking your browsing outside this site. I'm not selling your URL to anyone; I don't even have a way to.",
    category: "trust-privacy",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "is-my-url-public",
    question: "Can other people see my roast?",
    answer: "Only if you share the link. I'm brutal, not a gossip.",
    category: "trust-privacy",
    typingDelayMs: [1500, 3000],
    followUpIds: ["what-do-you-store"],
  },
  {
    id: "why-wrong-about-my-site",
    question:
      "You said something's missing but it's actually on my site — why?",
    answer:
      "I read your site's raw code, not what loads after JavaScript kicks in. If something's injected in after the fact, I might miss it. When I'm not sure, I say so instead of guessing — flag it and I'll take a second look.",
    category: "trust-privacy",
    typingDelayMs: [1500, 3000],
    followUpIds: ["suggestion-feedback"],
  },
  {
    id: "suggestion-feedback",
    question: "I have a suggestion to improve the site, where do I say it?",
    answer:
      "Send it my way through the Contact page — footer link. I read all of them, even the ones that just say 'add dark mode.'",
    category: "trust-privacy",
  },
];
