/**
 * Thin OpenRouter client used by every agent in the pipeline.
 *
 * We deliberately keep this isolated so each agent can swap models or
 * sampling params without touching the rest of the pipeline.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-3-haiku";

export class OpenRouterError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
  }
}

export interface CallClaudeOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  system?: string;
}

/**
 * Call Claude via OpenRouter and return the raw assistant text content.
 *
 * Throws OpenRouterError when the key is missing or the upstream call
 * fails — callers (agents) decide whether to fall back to dummy data.
 */
export async function callClaude(
  prompt: string,
  options: CallClaudeOptions = {},
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_key_here") {
    throw new OpenRouterError("OPENROUTER_API_KEY is not configured");
  }

  const body = {
    model: options.model ?? DEFAULT_MODEL,
    max_tokens: options.maxTokens ?? 800,
    temperature: options.temperature ?? 0.7,
    messages: [
      ...(options.system ? [{ role: "system", content: options.system }] : []),
      { role: "user", content: prompt },
    ],
  };

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_SITE_NAME ?? "BrandAutopilot",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new OpenRouterError(
      `Network error calling OpenRouter: ${(err as Error).message}`,
    );
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new OpenRouterError(
      `OpenRouter responded ${res.status}: ${errText.slice(0, 200)}`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenRouterError("OpenRouter returned no content");
  }
  return content;
}

/**
 * Extract the first JSON object from a model response.
 *
 * Models occasionally wrap JSON in ```json fences or add a sentence
 * of preamble — this is more forgiving than JSON.parse on the raw string.
 */
export function extractJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in response");
  }
  const slice = candidate.slice(start, end + 1);
  return JSON.parse(slice) as T;
}
