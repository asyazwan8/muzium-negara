# Muzium Negara Guide

A standalone chat guide to **Muzium Negara**, the National Museum in Kuala Lumpur. Chat with **Kancil**, the clever little mouse-deer of Malay folklore reimagined as your museum guide, who answers questions about the four permanent galleries (*Galeri A: Sejarah Awal*, *Galeri B: Kerajaan-Kerajaan Melayu*, *Galeri C: Era Kolonial*, *Galeri D: Malaysia Kini*) and the artifacts inside.

A self-contained Next.js project with a clean "modern museum" redesign (deep museum red on a neutral canvas): a landing page with a *pantun*, and a chat page set over Kancil's portrait.

## Meet Kancil

**Kancil** is *Sang Kancil*, the quick-witted *pelanduk* (mouse-deer) from Malaysian folk tales, who famously outsmarted tigers and crocodiles with cleverness rather than strength. Here she wears a *tengkolok* and a *batik* sampin, carries a scroll of stories, and puts that same clever, curious mind to work making Malaysian history feel alive and easy. She's warm, a touch playful, and a natural storyteller, but she never bluffs: she answers only from the museum knowledge base and says so honestly when she isn't sure. Her persona lives in `lib/persona.ts`.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fasyazwan8%2Fmuzium-negara&env=OLLAMA_BASE_URL,OLLAMA_API_KEY,OLLAMA_MODEL&envDescription=Ollama-compatible%20model%20credentials%20for%20Ara&project-name=muzium-negara&repository-name=muzium-negara)

Click the button, then set the three environment variables below when prompted. Vercel auto-detects Next.js (see `vercel.json`), so no extra build config is needed.

## How it works

- Kancil's answers are **grounded** in a curated knowledge base (`lib/kb.ts`), sourced from the official museum site. The system prompt (`lib/persona.ts`) instructs her to answer only from that knowledge base and to say honestly when she isn't sure, so she doesn't invent facts, dates, or artifacts.
- Malay proper names (gallery, artifact and place names) are kept exactly as written and shown in italics.
- The chat streams token by token, then reveals Kancil's reply as separate, human-paced bubbles.

## Tech

- [Next.js 16](https://nextjs.org/) (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/react`) for streaming chat
- An OpenAI-compatible model served via [Ollama](https://ollama.com/) (Kimi by default)
- Tailwind CSS v4 + shadcn-style UI primitives

## Getting started

Install dependencies:

```bash
npm install
```

Configure the model. Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable          | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `OLLAMA_BASE_URL` | `https://ollama.com/v1` (cloud) or `http://localhost:11434/v1`     |
| `OLLAMA_API_KEY`  | Your Ollama Cloud key (optional for local dev)                     |
| `OLLAMA_MODEL`    | The exact model tag, e.g. `kimi-k2-thinking:cloud`                 |

These are **server-only**; the key never reaches the browser.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

## Image assets

Two images bring the app to life. Both are loaded from `public/` and **degrade gracefully if missing** (the logo falls back to a built-in wordmark, and Kancil falls back to a simple SVG face), so the app always builds and deploys, then upgrades the moment you add the files:

| File               | Used for                                   | Notes                                                                 |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------- |
| `public/logo.png`  | The Muzium Negara logo in the header       | Any web image format works; rename the file or the `LOGO_SRC` constant to match. |
| `public/kancil.png`| Kancil's avatar and the welcome portrait   | A square or head-and-shoulders crop looks best as the small circular avatar. |

Just drop the two files into `public/` and redeploy. No code change needed.

## Project layout

```
app/
  api/chat/route.ts   # grounded streaming chat endpoint
  layout.tsx          # fixed app shell, fonts, theme, toaster
  page.tsx            # landing page (logo, pantun, "Talk to Kancil")
  chat/page.tsx       # chat page (Kancil photo backdrop)
components/
  muzium-chat.tsx     # the chat UI (streaming + human-paced reveal)
  logo.tsx            # Muzium Negara logo (image, wordmark fallback)
  kancil-avatar.tsx   # Kancil's portrait avatar (image, SVG face fallback)
  face-avatar.tsx     # simple SVG face used as Kancil's fallback
  chat-bubble.tsx     # message bubble with light markdown rendering
  quick-reply-chips.tsx
lib/
  kb.ts               # Muzium Negara knowledge base + title
  persona.ts          # Kancil's character + grounded system prompt
  ai/ollama.ts        # model wiring (OpenAI-compatible via Ollama)
  ai/messages.ts      # UIMessage -> ModelMessage helpers
public/
  logo.png            # official logo (you provide)
  kancil.png          # Kancil character art (you provide)
```
