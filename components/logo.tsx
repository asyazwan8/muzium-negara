"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.png";

// A small neoclassical museum-facade glyph (pediment + columns), in the brand
// red. Used as the wordmark fallback if the official logo file is missing.
function MuseumMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Muzium Negara"
      className={cn("fill-primary shrink-0", className)}
    >
      <path d="M24 5 L44 17 H4 Z" />
      <rect x="5" y="19" width="38" height="3.5" rx="1" />
      <rect x="8" y="24.5" width="4" height="13" rx="1" />
      <rect x="16.5" y="24.5" width="4" height="13" rx="1" />
      <rect x="27.5" y="24.5" width="4" height="13" rx="1" />
      <rect x="36" y="24.5" width="4" height="13" rx="1" />
      <rect x="4" y="39" width="40" height="4" rx="1.5" />
    </svg>
  );
}

/**
 * Muzium Negara logo. Renders the official mark from `public/logo.png`.
 * If that file is missing, it falls back to a clean built-in wordmark so the
 * header never looks broken.
 */
export function Logo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_SRC}
        alt="Muzium Negara"
        onError={() => setFailed(true)}
        className={cn("h-10 w-auto select-none", className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <MuseumMark className="size-8" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-foreground text-[15px] font-extrabold tracking-tight">
          Muzium Negara
        </span>
        <span className="text-muted-foreground mt-0.5 text-[9px] font-medium tracking-[0.22em] uppercase">
          National Museum
        </span>
      </span>
    </span>
  );
}
