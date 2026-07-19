// utils/vexProgress.ts
const ROAST_COUNT_KEY = "vex-roast-count";
const SEEN_SLUGS_KEY = "vex-seen-slugs";

function getSnapshot(): number {
  if (typeof window === "undefined") return 0; // SSR guard
  return Number(localStorage.getItem(ROAST_COUNT_KEY) || 0);
}

function getServerSnapshot(): number {
  return 0; // deterministic value for the server render
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function recordRoastCompleted(slug: string) {
  const seen: string[] = JSON.parse(
    localStorage.getItem(SEEN_SLUGS_KEY) || "[]",
  );

  if (seen.includes(slug)) return;

  seen.push(slug);
  localStorage.setItem(SEEN_SLUGS_KEY, JSON.stringify(seen));

  const count = getSnapshot() + 1;
  localStorage.setItem(ROAST_COUNT_KEY, String(count));
  window.dispatchEvent(new Event("storage"));
}

export const vexProgressStore = { getSnapshot, getServerSnapshot, subscribe };
