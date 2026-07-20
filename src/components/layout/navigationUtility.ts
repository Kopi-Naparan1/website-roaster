"use client";

import { useState, useRef, useEffect } from "react";

export const navigation: { label: string; link: string }[] = [
  { label: "Roast", link: "#hero" },
  { label: "Capabilities", link: "#examples" },
  { label: "About", link: "#about" },
  { label: "FAQ", link: "#questionsYouMightAsk" },
];

export const resultPageNavigation: { label: string; link: string }[] = [
  { label: "Overview", link: "#overviewResultPage" },
  { label: "Breakdown", link: "#roastBreakDown" },
  { label: "Share", link: "#share" },
  { label: "Re-roast", link: "#reroast" },
  { label: "Back to home", link: "/" },
];

export const alreadyRoastedPageNavigation: { label: string; link: string }[] = [
  { label: "Overview", link: "#overviewResultPage" },
  { label: "Breakdown", link: "#roastBreakDown" },
  { label: "Re-roast", link: "#reroast" },
  { label: "Back to home", link: "/" },
];

export const contactNavigation: { label: string; link: string }[] = [
  { label: "Back to home", link: "/" },
];

export function getNavigationForThePage(pathname: string) {
  if (pathname === "/") return navigation;
  if (pathname.startsWith("/roast/")) return resultPageNavigation;
  if (pathname.startsWith("/r/")) return alreadyRoastedPageNavigation;
  if (pathname.startsWith("/contact")) return contactNavigation;
  return navigation;
}
// lib/useNavigationClick.ts

export function useNavigationClick() {
  const [activeNavigationButton, setActiveNavigationButton] = useState<
    string | null
  >(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleNavigationButtonClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    href: string,
  ) {
    const isHashLink = href.startsWith("#");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveNavigationButton(label);
    timeoutRef.current = setTimeout(() => setActiveNavigationButton(""), 1000);

    if (!isHashLink) {
      return; // real page navigation — let Link handle it
    }

    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  }

  return { activeNavigationButton, handleNavigationButtonClick };
}
