import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { KancilAvatar } from "@/components/kancil-avatar";
import { Button } from "@/components/ui/button";
import { CHARACTER_NAME, PANTUN } from "@/lib/persona";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-7 overflow-y-auto px-6 py-10 text-center">
      <Logo className="h-16 w-auto" />

      <KancilAvatar size="xl" contain />

      <figure className="bg-card ring-foreground/10 relative w-full max-w-sm rounded-2xl px-6 py-6 text-left shadow-sm ring-1">
        <span
          aria-hidden
          className="bg-primary absolute top-6 bottom-6 left-0 w-1 rounded-full"
        />
        <blockquote className="pl-3">
          <p className="font-heading text-foreground text-[17px] leading-relaxed font-semibold">
            {PANTUN.lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          <figcaption className="text-muted-foreground mt-4 text-[13px] leading-relaxed italic">
            {PANTUN.gloss.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </figcaption>
        </blockquote>
      </figure>

      <Button
        render={<Link href="/chat" />}
        className="h-12 gap-2 rounded-full px-8 text-base"
      >
        <MessageCircle className="size-5" aria-hidden />
        Talk to {CHARACTER_NAME}
      </Button>

      <p className="text-muted-foreground/80 max-w-xs text-[11px] leading-relaxed">
        An independent companion, not affiliated with the official museum.
      </p>
    </main>
  );
}
