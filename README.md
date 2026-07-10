# Muzium Negara Guide

A standalone chat guide to **Muzium Negara**, the National Museum in Kuala Lumpur. Chat with **Ara**, a warm, friendly museum guide who answers questions about the four permanent galleries (*Galeri A: Sejarah Awal*, *Galeri B: Kerajaan-Kerajaan Melayu*, *Galeri C: Era Kolonial*, *Galeri D: Malaysia Kini*) and the artifacts inside.

This was extracted from the Ara Travel app into its own self-contained Next.js project.

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
