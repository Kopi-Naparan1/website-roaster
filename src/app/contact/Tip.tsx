"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import GcashQR from "../../../public/contactpage/gcash-qr.webp";
import SectionLayout from "@/components/ui/Section";

const IS_LIVE = true;
const KOFI_URL = "https://ko-fi.com/kopinaparan";
const GCASH_NUMBER = "09067362015";

function CoffeeCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/coffee-count")
      .then((res) => res.json())
      .then((data) => {
        console.log("coffee count response:", data);
        setCount(data.count);
      })
      .catch((err) => {
        console.error("coffee count fetch failed:", err);
        setCount(null);
      });
  }, []);

  return (
    <p className="text-xs text-foreground/40">
      Coffees counted so far: {count ?? "…"}. Vex is watching this number
      closely.
    </p>
  );
}

function GcashCopyButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(GCASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed silently — number still visible to copy manually
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs underline text-foreground/60 hover:text-foreground transition-colors"
    >
      {copied ? "Copied!" : `GCash: ${GCASH_NUMBER} (tap to copy)`}
    </button>
  );
}

export default function Tip() {
  return (
    <SectionLayout
      sectionType="donation"
      className="mt-20"
      heading={
        IS_LIVE ? "Fine. The Tip Jar's Open." : "Fine. The Tip Jar's Coming."
      }
      childrenClassName="flex flex-col justify-center items-center"
      subHeading={
        IS_LIVE
          ? "Vex isn't going to beg. But he's counting."
          : "Vex isn't going to beg. But he's counting the days."
      }
      headingAndSubHeadingClassName="flex flex-col justify-center items-center text-center"
    >
      <div className="flex flex-col items-center gap-4 max-w-lg text-center bg-brand-100 p-6 rounded-sm">
        <p className="font-sans text-sm lg:text-base italic leading-loose text-foreground/80">
          No paywall here, no strings attached,
          <br />
          Vex roasts for free — that part&apos;s not up for debate.
          <br />
          But if a roast landed and you&apos;ve got a coffee to spare,
          <br />
          tip because you want to. Vex won&apos;t ask twice, he swears.
        </p>
        <a
          href={IS_LIVE ? KOFI_URL : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!IS_LIVE}
          title={!IS_LIVE ? "Not live yet — check back soon" : undefined}
          className={
            IS_LIVE
              ? "text-sm px-4 py-2 rounded-sm bg-primary text-background cursor-pointer inline-block"
              : "text-sm px-4 py-2 rounded-sm bg-brand-400/40 text-background cursor-not-allowed pointer-events-none inline-block"
          }
        >
          {IS_LIVE ? "Buy Vex a Coffee" : "Buy Vex a Coffee — Coming Soon"}
        </a>

        {IS_LIVE && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-50 h-50 rounded-sm overflow-hidden">
              <Image
                src={GcashQR}
                alt="GCash QR code"
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
            <GcashCopyButton />
          </div>
        )}

        <CoffeeCounter />
      </div>

      <p className="mt-6 text-sm text-foreground/60">
        — built solo by one dev, kept alive by coffee
      </p>
    </SectionLayout>
  );
}
