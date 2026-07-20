"use client";
import { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import SectionLayout from "@/components/ui/Section";
import Image from "next/image";
import GcashQR from "../../../public/contactpage/qr.webp";

const IS_LIVE = true;
const KOFI_URL = "https://ko-fi.com/kopinaparan";

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
    <p className="text-xs text-foreground/40 flex flex-col justify-center items-center">
      <span>
        Coffees counted so far:{" "}
        <span className="font-bold">{count ?? "…"}</span>.
      </span>
      <span>Vex is watching this number closely.</span>
    </p>
  );
}

export default function Tip() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <SectionLayout
      sectionType="donation"
      className="mt-20 bg-background-alt"
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
      <div className="flex flex-col items-center justify-between  gap-4 max-w-lg text-center dark:bg-brand-700 md:min-h-70 bg-brand-200 p-6 rounded-sm">
        <p className="font-sans text-sm lg:text-base italic leading-loose text-foreground/80">
          No paywall here, no hidden fee,
          <br />
          Just laughter shared between you and me.
          <br />
          If a roast brought warmth to your day,
          <br />A small coffee says more than words can say.
        </p>
        <a
          href={IS_LIVE ? KOFI_URL : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!IS_LIVE}
          title={!IS_LIVE ? "Not live yet — check back soon" : undefined}
          className={
            IS_LIVE
              ? "text-xs px-4 py-2 rounded-sm bg-primary text-background cursor-pointer inline-block hover:bg-brand-500 duration-75 ease-in-out transition-colors"
              : "text-xs px-4 py-2 rounded-sm bg-brand-400/40 text-background cursor-not-allowed pointer-events-none inline-block"
          }
        >
          {IS_LIVE ? (
            <div className="flex flex-row gap-1">
              <Coffee size={16}></Coffee>
              <span>Buy Vex a Coffee</span>
            </div>
          ) : (
            "Buy Vex a Coffee — Coming Soon"
          )}
        </a>

        <div
          onMouseDown={() => setIsHovered(!true)}
          onMouseEnter={() => setIsHovered(true)}
          className="relative flex justify-center items-center w-40 h-40 border rounded-sm  "
        >
          <p className="text-xs opacity-20 max-w-[90%]">
            Click or Hover to view Gcash QR code
          </p>
          {isHovered && (
            <Image
              fill
              alt="Gcash QR code "
              className="object-contain rounded-sm"
              src={GcashQR}
            ></Image>
          )}
        </div>

        <CoffeeCounter />
      </div>

      <p className="mt-6 text-sm text-foreground/60">
        — built solo by one dev, kept alive by coffee
      </p>
    </SectionLayout>
  );
}
