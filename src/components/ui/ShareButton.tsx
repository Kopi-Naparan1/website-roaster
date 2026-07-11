"use client";
import { Button } from "./Button";

import { useState } from "react";

export function ShareButton({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = `${window.location.origin}/r/${shareId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          url: shareUrl,
          title: "My Website Roaster score",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Button buttonClassName="w-full" variant="primary" onClick={handleShare}>
      {copied ? "Link Copied" : "Share"}
    </Button>
  );
}
