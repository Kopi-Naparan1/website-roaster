import type { StaticImageData } from "next/image";
import Stripe from "../../public/examples/stripe.webp";
import StripOg from "../../public/examples/stripe-og.webp";
import Nyro from "../../public/examples/nyro.webp";
import NyroOg from "../../public/examples/nyro-og.webp";
import Kopi from "../../public/examples/kopi.webp";
import KopiOg from "../../public/examples/kopi-og.webp";

export interface ExampleEntry {
  shareId: string; // key to fetch score/category breakdown from Redis snapshot
  siteUrl: string; // real site — screenshot links here, opens in new tab
  screenshotImage: StaticImageData; // static asset path, default state
  ogImage: StaticImageData; // static OG-card asset path, shown on hover
}

export const examplesData: ExampleEntry[] = [
  {
    shareId: "mmaUiYIq",
    siteUrl: "https://stripe.com",
    screenshotImage: Stripe,
    ogImage: StripOg,
  },
  {
    shareId: "DqcuY-TK",
    siteUrl: "https://kopi-naparan1.github.io/1_Nyro-Portfolio-Website/",
    screenshotImage: Nyro,
    ogImage: NyroOg,
  },
  {
    shareId: "qLStI7B9",
    siteUrl: "https://kopiportfoliowebsite.vercel.app/",
    screenshotImage: Kopi,
    ogImage: KopiOg,
  },
];
