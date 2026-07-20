"use client";

import { useState, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function useTheme() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [, forceRender] = useState(0);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    forceRender((n) => n + 1); // trigger re-read since there's no real subscription event
  }

  return { isDark, toggleTheme };
}
