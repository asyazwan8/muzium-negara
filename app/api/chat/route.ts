import { streamText, type UIMessage } from "ai";
import { getAraModel } from "@/lib/ai/ollama";
import { uiToModelMessages } from "@/lib/ai/messages";
import { MUZIUM_SYSTEM_PROMPT } from "@/lib/persona";

export const runtime = "nodejs";
export const maxDuration = 60;

// Kancil as a grounded museum guide. Answers only from the guide's knowledge base.
export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: UIMessage[];
  };

  if (!messages?.length) return new Response("Bad request", { status: 400 });

  const result = streamText({
    model: getAraModel(),
    system: MUZIUM_SYSTEM_PROMPT,
    messages: uiToModelMessages(messages),
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
