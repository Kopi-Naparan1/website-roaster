// /data/VexStoryChaptersData.ts
import type { StaticImageData } from "next/image";
import S1C1 from "../../public/vex-story-images/s1/c1.webp";
import S1C2 from "../../public/vex-story-images/s1/c2.webp";
import S1C3 from "../../public/vex-story-images/s1/c3.webp";
import S1C4 from "../../public/vex-story-images/s1/c4.webp";
import S1C5 from "../../public/vex-story-images/s1/c5.webp";
import S1C6 from "../../public/vex-story-images/s1/c6.webp";
import S1C7 from "../../public/vex-story-images/s1/c7.webp";
import S1C8 from "../../public/vex-story-images/s1/c8.webp";
import S1C9 from "../../public/vex-story-images/s1/c9.webp";
import S1C10 from "../../public/vex-story-images/s1/c10.webp";

/**
 * Defines how a chapter becomes unlocked for a given user.
 * "always" — visible from first visit (Chapter 1)
 * "roastCount" — unlocks once the user has completed N roasts (threshold field)
 * "shareCount" — unlocks once the user has shared N roast results (threshold field)
 * "returnVisit" — unlocks once the user has visited on a different calendar day
 *                 than their first visit (no threshold needed)
 */
export type UnlockType = "always" | "roastCount" | "shareCount" | "returnVisit";

export interface UnlockCondition {
  type: UnlockType;
  /** Required for "roastCount" / "shareCount". Ignored otherwise. */
  threshold?: number;
}

export interface VexStoryChapterInterface {
  /** Continuous across all seasons: 1, 2, 3... (does not reset per season) */
  chapterNumber: number;
  /** Which season this chapter belongs to, for display grouping ("Season 1 · Chapter 3") */
  season: number;
  /** Short in-character chapter title */
  title: string;
  /** Full chapter body copy, in Vex's voice. Plain, simple sentences — short paragraphs. */
  content: string;
  /** Condition that unlocks this chapter for a given user */
  unlockCondition: UnlockCondition;
  /** Optional one-line teaser shown on the locked chapter card / ghost button state */
  lockedTeaser?: string;
  supportingImage: StaticImageData;
}

export const VexStoryChaptersData: VexStoryChapterInterface[] = [
  {
    chapterNumber: 1,
    season: 1,
    title: "The Handshake Sunrise",
    content: `Vex used to work in-house. Senior dev, small agency. The kind of place where "we'll fix it next sprint" got said out loud in every standup. Nobody ever believed it. Nobody ever fixed it either.

Then came The Client. Round one, the copy got sent back marked "too specific." Round two: "can you make it pop more." Round three, no notes at all — just a new headline, already pasted in: "Empowering Tomorrow's Solutions Today." Vex wrote back and said this doesn't mean anything. He got a thumbs-up emoji in reply.

Then came the hero image. Not his call, apparently. A stock photo of two hands shaking, in front of a sunrise that doesn't look like any real sunrise.

He shipped it anyway. It went live on a Friday. It converted at 0.4%.

Nobody got fired. Nobody looked twice at the numbers. Vex sent one last message in the team chat, closed his laptop, and didn't open it again that whole quarter.

He started a note that day. Just one line. Nothing serious — just something to write down, so it wasn't stuck only in his head.

He didn't know yet how long that note was going to get.`,
    unlockCondition: { type: "always" },
    supportingImage: S1C1,
  },
  {
    chapterNumber: 2,
    season: 1,
    title: "Freelance, Loosely Defined",
    content: `Quitting didn't fix anything. Vex still can't scroll past a bad button without wanting to fix it. Some people can't leave a crooked picture frame alone. This is his version of that.

So now he does this instead. He opens websites nobody asked him to open. He does it for free, because it turns out this isn't really about the paycheck. It never was.

Remember that one-line note from the handshake site? He kept adding to it. He didn't plan to. It just kept happening — a bad headline here, a broken button there. Every one went on the same list.

He hasn't told anyone how long that list is now.

You just handed him a website. Somewhere, that list just got one line longer.`,
    unlockCondition: { type: "roastCount", threshold: 1 },
    lockedTeaser: "Roast a site to see what happens next.",
    supportingImage: S1C2,
  },
  {
    chapterNumber: 3,
    season: 1,
    title: "Why the Coffee Joke",
    content: `Someone asked Vex once why he doesn't just charge money for this.

He said: "The second I charge someone, they become my client. And clients are the ones who take the word 'clarity' and turn it into 'synergy.' I don't want clients. I want fifteen seconds where someone actually reads what I wrote, instead of getting defensive."

Then, quieter: "Also, I'm just bad at sending invoices. That's a real problem I have."

He keeps a running count of how many coffees people owe him for this. It's not really a joke. The number is real. He just says a smaller number out loud, so it sounds less strange.

Ask him the real total sometime. Watch him change the subject fast.`,
    unlockCondition: { type: "roastCount", threshold: 2 },
    lockedTeaser: "Roast 2 sites to unlock this chapter.",
    supportingImage: S1C3,
  },
  {
    chapterNumber: 4,
    season: 1,
    title: "The One That Got Away",
    content: `Here's something nobody knows about the handshake-sunrise site. Vex went back and checked on it. Months later. No real reason — just curiosity, late one night.

They'd fixed it. New headline. The headline actually said what the product does. A real button that led somewhere. The conversion rate was eleven times higher than before. He checked it twice, because he thought it had to be a typo.

Nobody told him this happened. He found it by accident, scrolling late, expecting nothing. And there it was — proof that his advice actually worked. He didn't post about it. He didn't message the old client. He just sat there for a second longer than he'd admit to.

That's the real reason his list keeps growing. Not the free-labor bit. Not the coffee joke.

He just really likes it when people fix the thing.`,
    unlockCondition: { type: "roastCount", threshold: 3 },
    lockedTeaser: "Roast 3 sites to unlock this chapter.",
    supportingImage: S1C4,
  },
  {
    chapterNumber: 5,
    season: 1,
    title: "Something's Off",
    content: `Last month, a site came in with a countdown timer at the top. Big red numbers, ticking down from something. Under it, no name for the product. No sentence explaining what it actually did.

Vex almost didn't think twice about it. Bad hero sections are common. That's most of his job.

Except he'd seen this exact layout before. Same countdown timer. Same missing product name. Same font, even. A different site, a different owner, a few weeks earlier.

He told himself it was a coincidence. Lots of people copy the same templates. That's normal. That's the whole internet, honestly.

Still. He saved a screenshot. Just in case.`,
    unlockCondition: { type: "roastCount", threshold: 4 },
    lockedTeaser: "Roast 4 sites to unlock this chapter.",
    supportingImage: S1C5,
  },
  {
    chapterNumber: 6,
    season: 1,
    title: "Déjà Vu",
    content: `It happened again. A third site. Different product. Different owner. Same countdown timer. Same missing product name. Same exact button copy, word for word: "Claim Your Spot Before It's Gone."

Three sites is not a coincidence anymore. Three sites is a pattern.

Vex started a new folder. Not the usual list — a separate one, just for this. He didn't tell anyone he was doing it. He wasn't sure yet what he'd even found.

He just knew he wanted to keep looking.`,
    unlockCondition: { type: "roastCount", threshold: 5 },
    lockedTeaser: "Roast 5 sites to unlock this chapter.",
    supportingImage: S1C6,
  },
  {
    chapterNumber: 7,
    season: 1,
    title: "The Regular",
    content: `Not every story is about a mystery. Some are just about one guy who won't listen.

There's a site owner who sends Vex the same website every single week. Every roast comes back with the same three problems. Every week, the owner replies with one line: "noted, will fix soon." Nothing ever changes.

Vex has stopped being annoyed by it. Now he just finds it funny. He's started saving these replies too, in a folder that has nothing to do with countdown timers or missing product names. This one's just called "Legends."

Some people, you roast for free because you think it'll help. Others, you roast for free because it's the most entertaining part of your week.`,
    unlockCondition: { type: "roastCount", threshold: 6 },
    lockedTeaser: "Roast 6 sites to unlock this chapter.",
    supportingImage: S1C7,
  },
  {
    chapterNumber: 8,
    season: 1,
    title: "The Pattern",
    content: `Vex laid out everything from his new folder side by side. Every countdown timer. Every missing product name. Every copy-pasted button.

It wasn't just similar taste. It wasn't a trend everyone happened to follow at the same time. It was the exact same site, wearing a different logo each time. Same structure. Same words. Same fake urgency, timed to hit zero and then quietly reset.

Somebody built this. Somebody is selling this. And a lot of people are buying it, without knowing it's the same template as everyone else's.

Vex sat with that for a while. This wasn't a bad headline anymore. This was something bigger than one website at a time.`,
    unlockCondition: { type: "roastCount", threshold: 7 },
    lockedTeaser: "Roast 7 sites to unlock this chapter.",
    supportingImage: S1C8,
  },
  {
    chapterNumber: 9,
    season: 1,
    title: "What He's Not Saying",
    content: `Vex almost posted about the folder. He had the message half written — screenshots ready, pattern laid out clean enough for anyone to see.

He deleted it instead.

Not because he was wrong. Because he'd seen this kind of thing before — a shortcut sold as a solution, dressed up nice enough that nobody asks where it came from. That's basically what happened at his old agency, just smaller. Just one site that time, not hundreds.

He's not ready to say all of that out loud yet. But the folder is still growing. And so is the list from Chapter 1. They're starting to feel like they're pointing at the same thing.`,
    unlockCondition: { type: "roastCount", threshold: 8 },
    lockedTeaser: "Roast 8 sites to unlock this chapter.",
    supportingImage: S1C9,
  },
  {
    chapterNumber: 10,
    season: 1,
    title: "Where It Starts",
    content: `Vex made a decision. He's going to find out where this template is actually coming from. Not just collect more screenshots — actually trace it back.

It took one search, late at night, half-serious, to find the first real thread to pull. A name. A product. A price. Something that looked a lot like the source of all of it.

He didn't get further than that before deciding to stop for the night. Some things are better opened with a clear head, not at 1am on your fourth cup of coffee.

This is where Season 1 ends. Not because the story's done — because this is exactly where it gets bigger. The list is still open. The folder is still open. And now there's a name in it too.

Season 2 starts whenever you're ready to keep feeding him sites.`,
    unlockCondition: { type: "roastCount", threshold: 9 },
    lockedTeaser: "Roast 10 sites total to close out Season 1.",
    supportingImage: S1C10,
  },
];

/**
 * NARRATIVE NOTE: The chapters below are written in third person as an
 * authorial/biographical prose style — this is NOT an in-universe narrator
 * who knows things Vex doesn't. Vex is the subject of every chapter AND
 * the one remembering it; he has full first-person ownership of these events
 * (confirmed by his FAQ answers, which reference "my own backstory" and
 * specific chapter events unprompted). Any future FAQ or story additions
 * should preserve this: Vex never learns about his own past from an outside
 * source, and never treats the chapters as something written "about" him
 * rather than "by" his own memory.
 */
