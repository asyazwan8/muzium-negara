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

  try {
    const result = streamText({
      model: getModel(),
      system: buildSystemPrompt(lang === "ms" ? "ms" : "en"),
      messages: uiToModelMessages(messages),
      temperature: 0.3,
    });

    return result.toUIMessageStreamResponse({
      // Forward the real reason (bad key, wrong model tag, unreachable URL) to
      // the client toast and the Vercel function logs instead of masking it.
      onError: (error) => {
        console.error("[api/chat] stream error:", error);
        return error instanceof Error ? error.message : "Chat request failed.";
      },
    });
  } catch (error) {
    console.error("[api/chat] setup error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Chat is not configured. Check the OLLAMA_* environment variables.";
    return new Response(message, { status: 500 });
  }
}
