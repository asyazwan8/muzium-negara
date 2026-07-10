import type { ModelMessage, UIMessage } from "ai";

type MaybePart = { type: string; text?: string };

/** Flattens a UIMessage's text parts into a plain string for persistence. */
export function partsToText(
  message: { parts?: MaybePart[] } | null | undefined,
): string {
  if (!message?.parts) return "";
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
    .trim();
}

/** Convert a UIMessage history into plain ModelMessages for the LLM call. */
export function uiToModelMessages(messages: UIMessage[]): ModelMessage[] {
  return messages
    .map((m) => ({ role: m.role, content: partsToText(m) }))
    .filter((m) => m.content) as ModelMessage[];
}
