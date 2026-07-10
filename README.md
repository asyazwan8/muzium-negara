# Muzium Negara Guide

A standalone chat guide to **Muzium Negara**, the National Museum in Kuala Lumpur. Chat with **Ara**, a warm, friendly museum guide who answers questions about the four permanent galleries (*Galeri A: Sejarah Awal*, *Galeri B: Kerajaan-Kerajaan Melayu*, *Galeri C: Era Kolonial*, *Galeri D: Malaysia Kini*) and the artifacts inside.

This was extracted from the Ara Travel app into its own self-contained Next.js project, with a clean "modern museum" redesign (deep museum red on a neutral canvas).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fasyazwan8%2Fmuzium-negara&env=OLLAMA_BASE_URL,OLLAMA_API_KEY,OLLAMA_MODEL&envDescription=Ollama-compatible%20model%20credentials%20for%20Ara&project-name=muzium-negara&repository-name=muzium-negara)

Click the button, then set the three environment variables below when prompted. Vercel auto-detects Next.js (see `vercel.json`), so no extra build config is needed.

## How it works

- Ara's answers are **grounded** in a curated knowledge base (`lib/kb.ts`), sourced from the official museum site. The system prompt instructs her to answer only from that knowledge base and to say honestly when she isn't sure, so she doesn't invent facts, dates, or artifacts.
- Malay proper names (gallery, artifact and place names) are kept exactly as written and shown in italics.
- The chat streams token by token, then reveals Ara's reply as separate, human-paced bubbles with a matching facial expression.

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

## Using the official logo

The header currently shows a clean placeholder wordmark (`components/logo.tsx`) so the app deploys immediately. To use the real Muzium Negara logo:

1. Drop the logo file at `public/logo.png` (or `.svg`).
2. In `components/logo.tsx`, set `USE_IMAGE_LOGO = true` (and adjust `LOGO_SRC` if needed).

## Project layout

```
app/
  api/chat/route.ts   # grounded streaming chat endpoint
  layout.tsx          # fonts, theme, toaster
  page.tsx            # renders the chat
components/
  muzium-chat.tsx     # the chat UI (streaming + human-paced reveal)
  ara-avatar.tsx      # Ara's expressive SVG face
  chat-bubble.tsx     # message bubble with light markdown rendering
  quick-reply-chips.tsx
lib/
  kb.ts               # Muzium Negara knowledge base + title
  emotion.ts          # picks Ara's expression from her message text
  ai/ollama.ts        # model wiring (OpenAI-compatible via Ollama)
  ai/messages.ts      # UIMessage -> ModelMessage helpers
```
