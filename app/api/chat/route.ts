import { streamText, type UIMessage } from "ai";
import { getModel } from "@/lib/ai/ollama";
import { uiToModelMessages } from "@/lib/ai/messages";
import { buildSystemPrompt } from "@/lib/persona";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 60;

// Kancil as a grounded museum guide. Answers only from the guide's knowledge base.
export async function POST(req: Request) {
  const { messages, lang } = (await req.json()) as {
    messages: UIMessage[];
    lang?: Lang;
  };

  if (!messages?.length) return new Response("Bad request", { status: 400 });

  const result = streamText({
    model: getModel(),
    system: buildSystemPrompt(lang === "ms" ? "ms" : "en"),
    messages: uiToModelMessages(messages),
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
