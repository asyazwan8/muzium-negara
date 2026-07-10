"use client";

import { useEffect, useState } from "react";

export type Lang = "en" | "ms";

export const LANG_STORAGE_KEY = "muzium-lang";

/** UI copy for both languages. Kancil's chat replies are localised server-side. */
export const STRINGS = {
  en: {
    langName: "English",
    talkToKancil: "Talk to Kancil",
    landingDisclaimer:
      "An independent companion, not affiliated with the official museum.",
    guideByline: "Sang Kancil, your Muzium Negara guide",
    welcome:
      "salam, welcome to Muzium Negara 🙂 i'm Kancil, the little mouse-deer. ask me anything about the four galleries and what's inside, and i'll tell you the story.",
    starters: [
      "What's in Galeri A?",
      "Tell me about Manusia Perak",
      "What can I see here?",
    ],
    inputPlaceholder: "Ask about Muzium Negara…",
    typing: "Kancil is typing..",
    chatDisclaimer:
      "Kancil answers from Muzium Negara's permanent-gallery guide. An independent companion, not affiliated with the official museum.",
    backLabel: "Back to home",
    errorHiccup: "Kancil had a little hiccup. Mind trying again?",
  },
  ms: {
    langName: "Bahasa Melayu",
    talkToKancil: "Berbual dengan Kancil",
    landingDisclaimer:
      "Teman bebas, tiada kaitan rasmi dengan pihak muzium.",
    guideByline: "Sang Kancil, pemandu Muzium Negara anda",
    welcome:
      "salam, selamat datang ke Muzium Negara 🙂 saya Kancil, si pelanduk kecil. tanyalah saya apa-apa tentang empat galeri dan isinya, nanti saya ceritakan kisahnya.",
    starters: [
      "Apa ada dalam Galeri A?",
      "Ceritakan tentang Manusia Perak",
      "Apa yang boleh saya lihat di sini?",
    ],
    inputPlaceholder: "Tanya tentang Muzium Negara…",
    typing: "Kancil sedang menaip..",
    chatDisclaimer:
      "Kancil menjawab berdasarkan panduan galeri tetap Muzium Negara. Teman bebas, tiada kaitan rasmi dengan pihak muzium.",
    backLabel: "Kembali ke laman utama",
    errorHiccup: "Kancil tersasul sikit. Cuba lagi ya?",
  },
} as const;

function isLang(v: unknown): v is Lang {
  return v === "en" || v === "ms";
}

/**
 * Reads/writes the chosen language, persisted in localStorage and synced across
 * open tabs/components. Defaults to English on the server and first paint.
 */
export function useLang(): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) setLangState(stored);

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Lang>).detail;
      if (isLang(next)) setLangState(next);
    };
    window.addEventListener("muzium-lang-change", onChange);
    return () => window.removeEventListener("muzium-lang-change", onChange);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
    window.dispatchEvent(
      new CustomEvent<Lang>("muzium-lang-change", { detail: next }),
    );
  };

  return [lang, setLang];
}
