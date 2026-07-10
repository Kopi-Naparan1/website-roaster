// src\components\homepage\Hero.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import SectionLayout from "../ui/Section";
import { Button } from "../ui/Button";
import { isValidUrl } from "@/app/lib/validateUrl";
import { useRouter } from "next/navigation";

interface HeroProps {
  sectionType: "hero"; // This serves as the second check if the section type is really "hero"
  heading: string;
  subHeading?: string;
}

function calculateProgress(elapsedSeconds: number): number {
  const target = 92; // never auto-completes past this
  const speed = 0.25; // tune this — higher = faster climb
  return target * (1 - Math.exp(-speed * elapsedSeconds));
}

export default function Hero({ sectionType, heading, subHeading }: HeroProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [goodUrlIndicator, setgoodUrlIndicator] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDisabled = loading || url.trim().length === 0 || !!urlError;
  const router = useRouter();
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (url.trim().length === 0) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (isValidUrl(url)) {
        setUrlError(""); //After less than a second,  error URL will be cleared if url is valid
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

  function handleCancel() {
    abortControllerRef.current?.abort();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(false);
    setProgress(0);
    setElapsedSeconds(0);
  }

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
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setServerError(null);

    setProgress(0);
    setElapsedSeconds(0);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSeconds(Math.floor(elapsed));
      setProgress(calculateProgress(elapsed));
    }, 100);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          `${data.error}: ${url}` || "Something went wrong. Please try again.",
        );
        setgoodUrlIndicator("");
        return;
      }
      router.push(`/roast/${data.slug}`);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setServerError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => setLoading(false), 400);
    }
  }

  return (
    <SectionLayout
      className="flex flex-1 flex-col justify-center items-center text-center"
      headingAndSubHeadingClassName="flex flex-col justify-center items-center "
      childrenClassName="md:max-w-[60vw] w-full "
      sectionType={sectionType}
      heading={heading}
      subHeading={subHeading}
    >
      {" "}
      <div className="min-h-5 md:min-h-6 mt-1">
        {serverError ? (
          <p className="text-xs md:text-sm text-red-600 mb-1" role="alert">
            {serverError}
          </p>
        ) : urlError ? (
          <p className="text-xs md:text-sm text-red-600 mb-1">{urlError}</p>
        ) : goodUrlIndicator ? (
          <p className="text-xs md:text-sm text-green-500 mb-1">
            {goodUrlIndicator}
          </p>
        ) : null}
      </div>
      <div className="mb-2   flex flex-col md:flex-row gap-2 md:gap-1 md:justify-center  items-center md:items-start ">
        <div className="w-full max-w-auto flex-flex-col ">
          <input
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Input the URL of the site"
            className="w-full md:max-w-auto md:flex-1 rounded-sm border border-foreground/60 bg-input px-3 h-11   md:mb-0 focus:border-foreground focus:outline-none text-base font-normal leading-normal tracking-normal placeholder:text-base lg:placeholder:text-sm placeholder:font-normal placeholder:leading-normal placeholder:tracking-normal"
          ></input>
          <div
            className={`w-full max-w-auto my-1 ${loading ? "opacity-100" : "opacity-0"}`}
          >
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-foreground/60 mt-1">{elapsedSeconds}s</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="primary"
          onClick={() => handleRoast()}
          disabled={isDisabled}
        >
          {loading ? (
            <>
              Roasting <span className="animate-pulse">🔥</span>
            </>
          ) : (
            "Roast it!"
          )}
        </Button>

        <Button
          variant="ghost"
          buttonClassName={loading ? "" : "invisible "}
          onClick={handleCancel}
        >
          cancel
        </Button>
      </div>
    </SectionLayout>
  );
}
