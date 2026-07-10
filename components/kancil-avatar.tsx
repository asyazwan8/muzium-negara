"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FaceAvatar } from "@/components/face-avatar";

const SIZES = {
  xs: "size-6",
  sm: "size-7",
  md: "size-9",
  lg: "size-14",
  xl: "size-28",
} as const;

/**
 * Kancil's profile picture: a face-focused crop of the mouse-deer character.
 *
 * Renders `public/kancil-face.png` (a square crop centred on the face). If the
 * file is missing, it falls back to the friendly SVG face so the app never looks
 * broken. Borderless with a soft shadow for a storybook feel.
 */
export function KancilAvatar({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
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
      src="/kancil-face.png"
      alt="Kancil, your Muzium Negara guide"
      onError={() => setFailed(true)}
      className={cn(
        "bg-card shrink-0 rounded-full object-cover object-center shadow-sm select-none",
        SIZES[size],
        className,
      )}
    />
  );
}
