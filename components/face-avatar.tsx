import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-6",
  sm: "size-7",
  md: "size-9",
  lg: "size-12",
  xl: "size-20",
} as const;

/** Expression set for the simple fallback face. */
export type FaceExpression =
  | "calm"
  | "happy"
  | "laughing"
  | "excited"
  | "curious"
  | "surprised"
  | "thinking"
  | "reassuring"
  | "nervous"
  | "sad"
  | "sheepish"
  | "playful"
  | "content";

/** Optional colour override (e.g. to colour-code categories), independent of expression. */
export type FaceTone = "mint" | "blush" | "sky" | "lilac" | "sand" | "orange";

const TONE: Record<FaceTone, string> = {
  mint: "fill-companion-mint",
  blush: "fill-companion-blush",
  sky: "fill-companion-sky",
  lilac: "fill-companion-lilac",
  sand: "fill-companion-sand",
  orange: "fill-companion-orange",
};

/** Default background colour per expression. */
const BG: Record<FaceExpression, string> = {
  calm: "fill-companion-mint",
  happy: "fill-companion-blush",
  laughing: "fill-companion-blush",
  excited: "fill-companion-orange",
  curious: "fill-companion-lilac",
  surprised: "fill-companion-sky",
  thinking: "fill-companion-sky",
  reassuring: "fill-companion-mint",
  nervous: "fill-companion-sky",
  sad: "fill-companion-sky",
  sheepish: "fill-companion-blush",
  playful: "fill-companion-lilac",
  content: "fill-companion-sand",
};

type EyeKind = "closed" | "open" | "big" | "thinking" | "glance";
type MouthKind = "smile" | "open" | "squiggle" | "frown" | "o" | "tongue";
type FaceConfig = {
  eyes: EyeKind;
  mouth: MouthKind;
  brows?: boolean;
  accent?: "tear" | "sweat";
  cheeks?: boolean;
};

const FACE: Record<FaceExpression, FaceConfig> = {
  calm: { eyes: "closed", mouth: "smile", cheeks: true },
  happy: { eyes: "open", mouth: "smile", cheeks: true },
  laughing: { eyes: "closed", mouth: "open", cheeks: true },
  excited: { eyes: "big", mouth: "open", cheeks: true },
  curious: { eyes: "big", mouth: "smile", cheeks: true },
  surprised: { eyes: "big", mouth: "o" },
  thinking: { eyes: "thinking", mouth: "squiggle" },
  reassuring: { eyes: "closed", mouth: "smile", cheeks: true },
  nervous: { eyes: "open", mouth: "squiggle", brows: true, accent: "sweat" },
  sad: { eyes: "open", mouth: "frown", accent: "tear" },
  sheepish: { eyes: "glance", mouth: "smile", cheeks: true },
  playful: { eyes: "open", mouth: "tongue", cheeks: true },
  content: { eyes: "closed", mouth: "smile", cheeks: true },
};

const INK = "#2b2b2b";
const BLUSH = "#f4a9b8";
const DROP = "#7fb8e6";

function Eyes({ kind }: { kind: EyeKind }) {
  switch (kind) {
    case "open":
      return (
        <g fill={INK}>
          <circle cx={37} cy={45} r={5} />
          <circle cx={63} cy={45} r={5} />
        </g>
      );
    case "big":
      return (
        <g>
          <circle cx={37} cy={45} r={8} fill="#fff" stroke={INK} strokeWidth={3} />
          <circle cx={63} cy={45} r={8} fill="#fff" stroke={INK} strokeWidth={3} />
          <circle cx={38} cy={46} r={3.5} fill={INK} />
          <circle cx={64} cy={46} r={3.5} fill={INK} />
        </g>
      );
    case "thinking":
      return (
        <g fill={INK}>
          <circle cx={37} cy={42} r={4.5} />
          <circle cx={63} cy={42} r={4.5} />
        </g>
      );
    case "glance":
      return (
        <g fill={INK}>
          <circle cx={41} cy={45} r={4.5} />
          <circle cx={67} cy={45} r={4.5} />
        </g>
      );
    default: // closed, gentle upward arcs
      return (
        <g fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round">
          <path d="M30 46 Q37 39 44 46" />
          <path d="M56 46 Q63 39 70 46" />
        </g>
      );
  }
}

function Brows() {
  return (
    <g fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round">
      <path d="M29 37 L41 41" />
      <path d="M71 37 L59 41" />
    </g>
  );
}

function Mouth({ kind }: { kind: MouthKind }) {
  switch (kind) {
    case "open":
      return (
        <path
          d="M36 58 Q50 78 64 58 Z"
          fill={INK}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      );
    case "squiggle":
      return (
        <path
          d="M38 64 L44 60 L50 64 L56 60 L62 64"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "frown":
      return (
        <path
          d="M38 67 Q50 58 62 67"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    case "o":
      return (
        <ellipse
          cx={50}
          cy={64}
          rx={5}
          ry={6}
          fill="none"
          stroke={INK}
          strokeWidth={4}
        />
      );
    case "tongue":
      return (
        <g>
          <path
            d="M38 60 Q50 72 62 60"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <ellipse cx={50} cy={67} rx={5} ry={4} fill={BLUSH} />
        </g>
      );
    default: // gentle smile
      return (
        <path
          d="M38 61 Q50 72 62 61"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
  }
}

function Accent({ kind }: { kind: "tear" | "sweat" }) {
  // a small blue droplet
  const x = kind === "tear" ? 33 : 72;
  const y = kind === "tear" ? 52 : 34;
  return (
    <path
      d={`M${x} ${y} q-3 5 0 8 q3 -3 0 -8 z`}
      fill={DROP}
      stroke={INK}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  );
}

/**
 * A simple, friendly face drawn as SVG so it
 * stays crisp at any size and can shift mood with the conversation and per page.
 */
export function FaceAvatar({
  size = "md",
  expression = "calm",
  tone,
  cheeks,
  className,
}: {
  size?: keyof typeof SIZES;
  expression?: FaceExpression;
  tone?: FaceTone;
  cheeks?: boolean;
  className?: string;
}) {
  const face = FACE[expression];
  const showCheeks = cheeks ?? face.cheeks ?? false;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Kancil"
      className={cn("shrink-0 select-none", SIZES[size], className)}
    >
      <circle
        cx={50}
        cy={50}
        r={47}
        className={tone ? TONE[tone] : BG[expression]}
        stroke={INK}
        strokeWidth={3}
      />
      {showCheeks && (
        <g fill={BLUSH} opacity={0.85}>
          <ellipse cx={26} cy={58} rx={7} ry={4.5} />
          <ellipse cx={74} cy={58} rx={7} ry={4.5} />
        </g>
      )}
      {face.brows && <Brows />}
      <Eyes kind={face.eyes} />
      <Mouth kind={face.mouth} />
      {face.accent && <Accent kind={face.accent} />}
    </svg>
  );
}
