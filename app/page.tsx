"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { KancilAvatar } from "@/components/kancil-avatar";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { CHARACTER_NAME, PANTUN } from "@/lib/persona";
import { STRINGS, useLang } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useLang();
  const t = STRINGS[lang];

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex w-full justify-end px-4 pt-3">
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-10 text-center">
        <Logo className="h-24 w-auto" />

        <div className="flex flex-col items-center gap-2">
          <KancilAvatar size="xl" />
          <p className="font-heading text-foreground text-xl font-extrabold">
            {CHARACTER_NAME}
          </p>
          <p className="text-muted-foreground text-xs">{t.guideByline}</p>
        </div>

        <figure className="bg-accent/50 w-full max-w-sm rounded-3xl px-7 py-7 shadow-sm">
          <blockquote>
            <p className="font-heading text-foreground text-[19px] leading-relaxed font-bold">
              {PANTUN.lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>

            <div
              className="my-4 flex items-center justify-center gap-2"
              style={{ color: "var(--gold)" }}
              aria-hidden
            >
              <span className="h-px w-8 bg-current opacity-50" />
              <span className="text-sm">✦</span>
              <span className="h-px w-8 bg-current opacity-50" />
            </div>

            {lang === "en" && (
              <figcaption className="text-muted-foreground text-[13px] leading-relaxed italic">
                {PANTUN.gloss.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </figcaption>
            )}
          </blockquote>
        </figure>

        <Button
          render={<Link href="/chat" />}
          className="h-12 gap-2 rounded-full px-8 text-base font-bold"
        >
          <MessageCircle className="size-5" aria-hidden />
          {t.talkToKancil}
        </Button>

        <p className="text-muted-foreground/80 max-w-xs text-[11px] leading-relaxed">
          {t.landingDisclaimer}
        </p>
      </div>
    </main>
  );
}
