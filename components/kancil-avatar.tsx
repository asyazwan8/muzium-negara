"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FaceAvatar } from "@/components/face-avatar";

const SIZES = {
  xs: "size-6",
  sm: "size-7",
  md: "size-9",
  lg: "size-14",
  xl: "size-24",
} as const;

/**
 * Kancil's avatar: the mouse-deer character portrait.
 *
 * Renders `public/kancil.png`. The source is a full-body render on white, so as
 * a small circle we bias the crop toward the top (head + tengkolok). If the file
 * is missing, it falls back to the friendly SVG face so the app never looks broken.
 *
 * Set `contain` for a larger, uncropped portrait (e.g. the welcome hero).
 */
export function KancilAvatar({
  size = "md",
  contain = false,
  className,
}: {
  size?: keyof typeof SIZES;
  contain?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A 404 can happen before hydration, so React's onError never fires. Re-check
  // on mount: a loaded-but-broken image reports naturalWidth 0.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return <FaceAvatar size={size} expression="happy" className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/kancil.png"
      alt="Kancil, your Muzium Negara guide"
      onError={() => setFailed(true)}
      className={cn(
        "bg-card ring-foreground/10 shrink-0 rounded-full ring-1 select-none",
        contain ? "object-contain p-1" : "object-cover object-[50%_18%]",
        SIZES[size],
        className,
      )}
    />
  );
}
