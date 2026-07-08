// src\components\homepage\Hero.tsx

"use client";
import { useState, useEffect } from "react";
import SectionLayout from "../ui/Section";
import { Button } from "../ui/Button";
import { isValidUrl } from "@/app/lib/validateUrl";
interface HeroProps {
  sectionType: "hero";
  heading: string;
  subHeading?: string;
}

export default function Hero({ sectionType, heading, subHeading }: HeroProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [goodUrlIndicator, setgoodUrlIndicator] = useState<string>("");

  useEffect(() => {
    if (url.trim().length === 0) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (isValidUrl(url)) {
        setUrlError("");
        setgoodUrlIndicator(
          "The URL is good for roasting! Hit the button Now!",
        );
      } else {
        setUrlError(
          "That doesn't look like a valid URL (e.g. https://example.com)",
        );
        setgoodUrlIndicator("");
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [url]);

  function handleChange(value: string) {
    setUrl(value);
    setUrlError("");
    setgoodUrlIndicator("");
    setServerError(null);
  }
  async function handleRoast() {
    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL first.");
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }

      console.log("Roast result:", data.roast, "cached:", data.cached);
    } catch {
      setServerError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setUrl("");
      setgoodUrlIndicator("");
      setUrlError("");
      setLoading(false);
    }
  }
  const isDisabled = loading || url.trim().length === 0 || !!urlError;

  return (
    <SectionLayout
      className="flex flex-1 flex-col justify-center items-center text-center"
      headingAndSubHeadingClassName="flex flex-col justify-center items-center "
      childrenClassName="md:max-w-[55vw] w-full "
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    >
      <div className="min-h-5 md:min-h-6 mt-1">
        {serverError && (
          <p className="text-xs md:text-sm text-red-600 mb-1" role="alert">
            {serverError}
          </p>
        )}
        {urlError && (
          <p className="text-xs md:text-sm text-red-600 mb-1">{urlError}</p>
        )}
        {goodUrlIndicator && (
          <p className="text-xs md:text-sm text-green-500 mb-1">
            {goodUrlIndicator}
          </p>
        )}
      </div>
      <div className="mb-5  flex flex-col md:flex-row gap-2 md:gap-3 md:justify-center  items-center ">
        <input
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Input the URL of the site"
          className="w-full md:w-auto md:flex-1 rounded-sm border border-foreground/60 bg-input px-3 h-11 mb-2 md:mb-0 focus:border-foreground focus:outline-none text-base font-normal leading-normal tracking-normal placeholder:text-base lg:placeholder:text-sm placeholder:font-normal placeholder:leading-normal placeholder:tracking-normal"
        ></input>
        <Button
          variant="primary"
          onClick={() => handleRoast()}
          disabled={isDisabled}
        ></Button>
      </div>
    </SectionLayout>
  );
}
