import { cn } from "@/lib/utils";

/**
 * Muzium Negara wordmark.
 *
 * PLACEHOLDER: this is a clean, deploy-ready wordmark, not the official emblem.
 * To use the real logo, drop the file at `public/logo.png` (or `.svg`) and set
 * `USE_IMAGE_LOGO` to true below (or replace this component with the <img>).
 */
const USE_IMAGE_LOGO = false;
const LOGO_SRC = "/logo.png";

// A small neoclassical museum-facade glyph (pediment + columns), in the brand red.
function MuseumMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Muzium Negara"
      className={cn("fill-primary shrink-0", className)}
    >
      {/* pediment */}
      <path d="M24 5 L44 17 H4 Z" />
      {/* architrave */}
      <rect x="5" y="19" width="38" height="3.5" rx="1" />
      {/* columns */}
      <rect x="8" y="24.5" width="4" height="13" rx="1" />
      <rect x="16.5" y="24.5" width="4" height="13" rx="1" />
      <rect x="27.5" y="24.5" width="4" height="13" rx="1" />
      <rect x="36" y="24.5" width="4" height="13" rx="1" />
      {/* base */}
      <rect x="4" y="39" width="40" height="4" rx="1.5" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  if (USE_IMAGE_LOGO) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_SRC}
        alt="Muzium Negara"
        className={cn("h-9 w-auto", className)}
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
