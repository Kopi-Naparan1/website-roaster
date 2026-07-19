// src/app/lib/useUrlRoastForm.ts
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isValidUrl } from "@/app/lib/validateUrl";
import { useRecentRoasts } from "./useRecentRoasts";
import { recordRoastCompleted } from "@/components/utils/VexProgress";
function calculateProgress(elapsedSeconds: number): number {
  const target = 92;
  const speed = 0.25;
  return target * (1 - Math.exp(-speed * elapsedSeconds));
}

export function useUrlRoastForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [goodUrlIndicator, setGoodUrlIndicator] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);
  const router = useRouter();
  const { addRoast } = useRecentRoasts();
  const isDisabled = loading || url.trim().length === 0 || !!urlError;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (url.trim().length === 0) return;
    const timeoutId = setTimeout(() => {
      if (isValidUrl(url)) {
        setUrlError("");
        setGoodUrlIndicator("The URL is good for roasting!");
      } else {
        setUrlError(
          "That doesn't look like a valid URL (e.g. https://example.com)",
        );
        setGoodUrlIndicator("");
      }
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [url]);

  function handleCancel() {
    cancelledRef.current = true;
    abortControllerRef.current?.abort();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(false);
    setProgress(0);
    setElapsedSeconds(0);
  }

  function handleChange(value: string) {
    setUrl(value);
    setUrlError("");
    setGoodUrlIndicator("");
    setServerError(null);
  }

  function handleBackToHome() {
    router.push("/");
  }

  async function handleRoast() {
    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL first.");
      return;
    }
    cancelledRef.current = false;
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
          data.error
            ? `${data.error}: ${url}`
            : "Something went wrong. Please try again.",
        );
        setGoodUrlIndicator("");

        return;
      }
      addRoast(url);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 350));
      if (cancelledRef.current) return;
      recordRoastCompleted(data.slug);
      router.push(`/roast/${data.slug}`);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Roast request failed: ", err);
      setServerError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoading(false);
      setProgress(0);
      setElapsedSeconds(0);
    }
  }

  return {
    url,
    loading,
    urlError,
    serverError,
    goodUrlIndicator,
    progress,
    elapsedSeconds,
    isDisabled,
    handleChange,
    handleRoast,
    handleCancel,
    handleBackToHome,
  };
}
