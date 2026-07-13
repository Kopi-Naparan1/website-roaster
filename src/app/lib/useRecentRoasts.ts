import { useSyncExternalStore, useCallback } from "react";

interface RecentRoast {
  url: string;
  timestamp: number;
}

const STORAGE_KEY = "recentRoasts";
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const MAX_ITEMS = 10;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]"; // no localStorage on the server
}

function parseRoasts(raw: string): RecentRoast[] {
  try {
    const parsed: RecentRoast[] = JSON.parse(raw);
    const cutoff = Date.now() - MAX_AGE_MS;
    return parsed.filter((r) => r.timestamp > cutoff);
  } catch {
    return [];
  }
}

export function useRecentRoasts() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const roasts = parseRoasts(raw);

  const addRoast = useCallback((url: string) => {
    const current = parseRoasts(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const filtered = current.filter((r) => r.url !== url);
    const updated = [{ url, timestamp: Date.now() }, ...filtered].slice(
      0,
      MAX_ITEMS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage")); // manually notify same-tab listeners
  }, []);

  const clearRoasts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { roasts, addRoast, clearRoasts };
}
