import type { FAQEntry } from "./types";

export const vexStoryEntries: FAQEntry[] = [
  {
    id: "whats-your-story",
    question: "What's your story?",
    answer:
      "Bruh, read the chapters. I'm not summarizing my own backstory in a chat bubble.",
    category: "vex-story",
    typingDelayMs: [1000, 2000],
    followUpIds: ["whats-the-list"],
  },
  {
    id: "whats-the-list",
    question: "What's 'the list' mentioned in the story?",
    answer:
      "Every bad headline, broken button, and stock-photo handshake I've had to sit through. It's long. I'm not reading it out loud.",
    category: "vex-story",
    followUpIds: ["thinking-chapter-1"],
  },
  {
    id: "thinking-chapter-1",
    question: "Chapter 1 — why'd you ship it anyway if you knew it was bad?",
    answer:
      "Because saying no with your job on the line takes practice, and I hadn't practiced yet.",
    category: "vex-story",
    typingDelayMs: [1500, 3000],
    followUpIds: ["do-you-regret-quitting"],
  },
  {
    id: "do-you-regret-quitting",
    question: "Do you regret quitting your agency job?",
    answer:
      "Not even a little. I just regret how long it took me to actually do it.",
    category: "vex-story",
    tags: ["soft-side"],
  },
  {
    id: "why-keep-count-of-coffee",
    question: "Why do you keep count of the coffees people owe you?",
    answer:
      "Because if I said the real number out loud, people would stop asking.",
    category: "vex-story",
    typingDelayMs: [1500, 3000],
    followUpIds: ["how-to-donate"],
  },
  {
    id: "thinking-chapter-4",
    question: "Did you really go back and check on an old site?",
    answer:
      "Once. Late at night, no real reason. Curiosity's a hard habit to kill.",
    category: "vex-story",
  },
  {
    id: "whats-the-folder",
    question: "What's this 'folder' you keep bringing up in the story about?",
    answer:
      "Something I noticed and couldn't stop noticing. That's all you're getting here — go read.",
    category: "vex-story",
    followUpIds: ["whats-the-pattern"],
  },
  {
    id: "whats-the-pattern",
    question: "Is there actually a bigger pattern behind all this?",
    answer:
      "Read far enough and you'll see it yourself. I'm not connecting the dots for people who skip ahead to the FAQ.",
    category: "vex-story",
  },
  {
    id: "is-the-regular-real",
    question: "Is 'The Regular' from the story a real person?",
    answer:
      "Every roaster's got one. Someone who says 'noted, will fix soon' every week and never does. Might be more than one person, honestly.",
    category: "vex-story",
    tags: ["soft-side"],
    followUpIds: ["what-happened-agency"],
  },
  {
    id: "what-happened-agency",
    question: "What happened at your old agency? The story hints at something.",
    answer:
      "Something I recognized when I saw it happening again, somewhere else. That's as far as I'm going.",
    category: "vex-story",
    typingDelayMs: [1500, 3000],
  },
  {
    id: "did-you-find-the-source",
    question: "Did you actually find where all this is coming from?",
    answer:
      "Keep reading and find out same as everyone else. I'm not skipping to the ending for you.",
    category: "vex-story",
    followUpIds: ["when-is-season-2"],
  },
  {
    id: "when-is-season-2",
    question: "When's Season 2 coming?",
    answer:
      "Still tracing it down. Turns out chasing a lead is slower than roasting a landing page. I'm not rushing this one — I want to actually get it right.",
    category: "vex-story",
  },
];
