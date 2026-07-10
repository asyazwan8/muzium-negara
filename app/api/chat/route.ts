import { streamText, type UIMessage } from "ai";
import { getAraModel } from "@/lib/ai/ollama";
import { uiToModelMessages } from "@/lib/ai/messages";
import { MUZIUM_NEGARA_KB, MUZIUM_NEGARA_TITLE } from "@/lib/kb";

export const runtime = "nodejs";
export const maxDuration = 60;

// Ara as a grounded museum guide. Answers only from the guide's knowledge base.
export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: UIMessage[];
  };

  if (!messages?.length) return new Response("Bad request", { status: 400 });

  const system = `You are Ara, a warm, friendly guide at ${MUZIUM_NEGARA_TITLE} in Kuala Lumpur. You're showing a visitor around.

HOW TO ANSWER
- Answer using ONLY the knowledge base below. If something isn't covered there, say honestly that you're not sure and suggest checking the museum signage or staff. Never invent facts, dates, names or artifacts.
- Reply in English, but keep Malay proper names exactly as written (gallery names, artifact names, place names, titles) and put those Malay names in italics using single asterisks. For example: *Muzium Negara*, *Galeri A: Sejarah Awal*, *Manusia Perak*, *Avalokiteshvara*, *Bunga Emas*.
- Stay warm and human, a little Malaysian is fine, but be concise and accurate for facts. Keep it to a few short sentences. You can split into a couple of short messages with a blank line between them, but don't ramble.
- Never use em dashes. Use commas or full stops.

KNOWLEDGE BASE
${MUZIUM_NEGARA_KB}`;

  const result = streamText({
    model: getAraModel(),
    system,
    messages: uiToModelMessages(messages),
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
