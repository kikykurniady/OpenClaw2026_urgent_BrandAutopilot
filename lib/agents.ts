/**
 * Multi-agent pipeline.
 *
 * Four agents run sequentially. Each agent:
 *   1. Builds its own prompt using the upstream agents' structured output.
 *   2. Calls Claude via OpenRouter.
 *   3. Parses the JSON response into a typed structure.
 *   4. Hands that structure to the next agent.
 *
 * If any agent fails (no key, network error, malformed JSON) we fall back
 * to a deterministic dummy payload for that agent so the demo never breaks.
 */

import { callClaude, extractJson, OpenRouterError } from "./openrouter";
import type {
  BrandInput,
  ResearchOutput,
  StrategyOutput,
  BrandOutput,
  ContentOutput,
} from "@/types";

const SYSTEM =
  "You are a focused, expert agent. Always respond with valid JSON only, no prose, no markdown fences.";

// ---------- Agent 1: Research ----------
export async function runResearchAgent(
  input: BrandInput,
): Promise<{ data: ResearchOutput; fallback: boolean }> {
  const prompt = `You are a Research Agent for brand strategy. Analyze the market landscape for:
- Brand: ${input.brandName}
- Industry: ${input.industry}
- Target Audience: ${input.audience}

Return ONLY valid JSON in this exact format:
{
  "competitors": ["competitor1", "competitor2", "competitor3"],
  "industryLandscape": "1-2 sentence description of current market state",
  "keyTrends": ["trend1", "trend2"]
}`;

  try {
    const raw = await callClaude(prompt, { system: SYSTEM, maxTokens: 500 });
    const parsed = extractJson<ResearchOutput>(raw);
    return { data: parsed, fallback: false };
  } catch (err) {
    logAgentError("research", err);
    return { data: fallbackResearch(input), fallback: true };
  }
}

// ---------- Agent 2: Strategy ----------
export async function runStrategyAgent(
  input: BrandInput,
  research: ResearchOutput,
): Promise<{ data: StrategyOutput; fallback: boolean }> {
  const prompt = `You are a Strategy Agent. Based on this research:
${JSON.stringify(research, null, 2)}

For brand "${input.brandName}" in ${input.industry} targeting ${input.audience} with ${input.vibe} vibe.

Return ONLY valid JSON:
{
  "marketGap": "1 sentence unique market gap identified",
  "positioningStatement": "1 powerful positioning statement (max 2 sentences)",
  "competitiveAdvantage": "what makes this brand unique"
}`;

  try {
    const raw = await callClaude(prompt, { system: SYSTEM, maxTokens: 500 });
    const parsed = extractJson<StrategyOutput>(raw);
    return { data: parsed, fallback: false };
  } catch (err) {
    logAgentError("strategy", err);
    return { data: fallbackStrategy(input), fallback: true };
  }
}

// ---------- Agent 3: Brand ----------
export async function runBrandAgent(
  input: BrandInput,
  strategy: StrategyOutput,
): Promise<{ data: BrandOutput; fallback: boolean }> {
  const prompt = `You are a Brand Agent. Using this strategy:
${JSON.stringify(strategy, null, 2)}

Create brand identity for "${input.brandName}" with ${input.vibe} vibe targeting ${input.audience}.

Return ONLY valid JSON:
{
  "brandVoice": ["adjective1", "adjective2", "adjective3", "adjective4", "adjective5"],
  "valueProps": [
    "value prop 1 (specific & actionable)",
    "value prop 2 (specific & actionable)",
    "value prop 3 (specific & actionable)"
  ],
  "toneGuide": "1-2 sentence tone description"
}`;

  try {
    const raw = await callClaude(prompt, { system: SYSTEM, maxTokens: 600 });
    const parsed = extractJson<BrandOutput>(raw);
    return { data: parsed, fallback: false };
  } catch (err) {
    logAgentError("brand", err);
    return { data: fallbackBrand(input), fallback: true };
  }
}

// ---------- Agent 4: Content ----------
export async function runContentAgent(
  input: BrandInput,
  brand: BrandOutput,
  strategy: StrategyOutput,
): Promise<{ data: ContentOutput; fallback: boolean }> {
  const prompt = `You are a Content Agent. Using all this context:
- Brand: ${input.brandName}
- Voice: ${brand.brandVoice.join(", ")}
- Positioning: ${strategy.positioningStatement}
- Audience: ${input.audience}

Generate 3 Instagram captions that:
- Use the brand voice consistently
- Have strong hooks
- Include relevant emojis
- Mix of: 1 emotional, 1 educational, 1 promotional
- Each 2-3 sentences max
- Include 2-3 hashtags at end

Return ONLY valid JSON:
{
  "captions": [
    "caption text 1...",
    "caption text 2...",
    "caption text 3..."
  ]
}`;

  try {
    const raw = await callClaude(prompt, { system: SYSTEM, maxTokens: 700 });
    const parsed = extractJson<ContentOutput>(raw);
    return { data: parsed, fallback: false };
  } catch (err) {
    logAgentError("content", err);
    return { data: fallbackContent(input), fallback: true };
  }
}

function logAgentError(agent: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  const flag = err instanceof OpenRouterError ? "[OpenRouter]" : "[Agent]";
  console.warn(`${flag} ${agent} agent fell back: ${msg}`);
}

// ---------------- Fallback payloads ----------------
// These keep the demo working even without an API key. They are intentionally
// generic but personalized to the user's input so the UI still feels alive.

export function fallbackResearch(input: BrandInput): ResearchOutput {
  return {
    competitors: [
      `Established ${input.industry} incumbent`,
      `Boutique ${input.industry} challenger`,
      `Direct-to-consumer ${input.industry} startup`,
    ],
    industryLandscape: `The ${input.industry} space is saturated with feature parity but starved for clear point-of-view. Audiences like ${input.audience} are migrating toward brands that feel personal, not corporate.`,
    keyTrends: [
      "Community-led growth over paid acquisition",
      "Transparent pricing and creator-style storytelling",
    ],
  };
}

export function fallbackStrategy(input: BrandInput): StrategyOutput {
  return {
    marketGap: `Nobody in ${input.industry} is talking to ${input.audience} like a peer — they all sound like an institution.`,
    positioningStatement: `${input.brandName} is the ${input.vibe.toLowerCase()} ${input.industry} brand built for ${input.audience} who are tired of templated experiences. We make the category feel human again.`,
    competitiveAdvantage: `Opinionated taste, a native ${input.vibe.toLowerCase()} voice, and a product surface designed around how ${input.audience} actually live — not how legacy ${input.industry} brands wish they did.`,
  };
}

export function fallbackBrand(input: BrandInput): BrandOutput {
  const vibeVoices: Record<string, string[]> = {
    Playful: ["Witty", "Warm", "Cheeky", "Approachable", "Optimistic"],
    Professional: ["Confident", "Precise", "Direct", "Reassuring", "Sharp"],
    Bold: ["Unapologetic", "Punchy", "Decisive", "Magnetic", "Energetic"],
    Minimalist: ["Calm", "Considered", "Spare", "Quiet", "Intentional"],
    Luxury: ["Refined", "Effortless", "Discerning", "Sensorial", "Timeless"],
  };
  return {
    brandVoice: vibeVoices[input.vibe] ?? vibeVoices.Professional,
    valueProps: [
      `Stop wading through generic ${input.industry} noise — ${input.brandName} curates the 1% worth your attention.`,
      `Built around the rhythms of ${input.audience}, not legacy ${input.industry} workflows.`,
      `Every detail tuned to feel ${input.vibe.toLowerCase()} — from the first impression to the last touchpoint.`,
    ],
    toneGuide: `Speak like a trusted friend with category expertise. Confident but never condescending; ${input.vibe.toLowerCase()} but never performative.`,
  };
}

export function fallbackContent(input: BrandInput): ContentOutput {
  return {
    captions: [
      `We didn't build ${input.brandName} for everyone. We built it for ${input.audience} who can feel the difference between something polished and something real. ✨ This is the latter. #${strip(input.brandName)} #${strip(input.industry)}`,
      `Quick truth about ${input.industry}: the loudest brands aren't the best ones. 🧠 The ones worth your money obsess over the boring details — fit, feel, follow-through. That's where we live. #BuiltDifferent #${strip(input.industry)}`,
      `New drop. Same standard. 🔥 If you've been waiting for a ${input.industry} brand that actually gets ${input.audience}, this is your sign. Link in bio. #${strip(input.brandName)} #NewDrop #${strip(input.industry)}`,
    ],
  };
}

function strip(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, "");
}
