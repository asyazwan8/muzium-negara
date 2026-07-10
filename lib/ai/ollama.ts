import "server-only";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * The chat model: Kimi served via Ollama Cloud through the OpenAI-compatible API.
 * Server-only, the key must never reach the browser.
 *
 * Production: OLLAMA_BASE_URL=https://ollama.com/v1, OLLAMA_API_KEY=<cloud key>,
 *             OLLAMA_MODEL=<exact Kimi cloud tag, e.g. kimi-k2-thinking:cloud>.
 * Local dev:  OLLAMA_BASE_URL=http://localhost:11434/v1 (key optional).
 */
const apiKey = process.env.OLLAMA_API_KEY?.trim();

/**
 * Normalise the base URL. `https://api.ollama.com/...` 301-redirects to
 * `https://ollama.com/...`, and a POST following a 301 becomes a GET → 405
 * Method Not Allowed. So rewrite the host and trim any trailing slash.
 */
function normaliseBaseUrl(raw: string | undefined): string {
  const base = (raw ?? "http://localhost:11434/v1").trim();
  return base.replace("://api.ollama.com", "://ollama.com").replace(/\/+$/, "");
}

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: normaliseBaseUrl(process.env.OLLAMA_BASE_URL),
  ...(apiKey ? { apiKey } : {}),
});

export function getModel() {
  const tag = process.env.OLLAMA_MODEL?.trim();
  if (!tag) {
    throw new Error(
      "OLLAMA_MODEL is not set, add the exact Kimi cloud tag (e.g. kimi-k2-thinking:cloud) to your environment.",
    );
  }
  return ollama(tag);
}
