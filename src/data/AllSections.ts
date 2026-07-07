interface Section {
  type: string;
  heading: string;
  subHeading: string;
}

export const AllSection: Section[] = [
  {
    type: "hero",
    heading: "Your website has problems. Let's find them.",
    subHeading:
      "Paste your URL. Get a senior designer's honest, specific feedback in 30 seconds — no fluff, no 'just make it pop.'",
  },
  {
    type: "examples",
    heading: "See what a roast looks like",
    subHeading: "Real sites, real scores, zero sugarcoating.",
  },
  {
    type: "overview",
    heading: "The Verdict",
    subHeading: "Your overall score, at a glance.",
  },
  {
    type: "clarity",
    heading: "Clarity",
    subHeading: "Does anyone know what you do in the first 5 seconds?",
  },
  {
    type: "copy",
    heading: "Copy",
    subHeading: "Clear and benefit-focused, or just jargon?",
  },

  {
    type: "trust",
    heading: "Trust",
    subHeading: "Would a stranger actually believe you?",
  },
  {
    type: "mobile",
    heading: "Mobile",
    subHeading: "Does it hold up on a phone, or fall apart?",
  },
  {
    type: "share",
    heading: "Share your roast",
    subHeading: "Share it. Let your friends' website get roasted too.",
  },
  {
    type: "reroast",
    heading: "Roast another website",
    subHeading:
      "Got a friend's site in mind? Paste it below and watch it squirm.",
  },
];
