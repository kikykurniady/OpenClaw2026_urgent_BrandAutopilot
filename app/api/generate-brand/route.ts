import { NextRequest, NextResponse } from "next/server";
import {
  runResearchAgent,
  runStrategyAgent,
  runBrandAgent,
  runContentAgent,
} from "@/lib/agents";
import type { BrandInput, BrandVibe, PipelineResult } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_VIBES: BrandVibe[] = [
  "Playful",
  "Professional",
  "Bold",
  "Minimalist",
  "Luxury",
];

function validateInput(body: unknown): BrandInput | string {
  if (!body || typeof body !== "object") return "Invalid request body";
  const b = body as Record<string, unknown>;
  const brandName = (b.brandName ?? "").toString().trim();
  const industry = (b.industry ?? "").toString().trim();
  const audience = (b.audience ?? "").toString().trim();
  const vibe = (b.vibe ?? "").toString().trim() as BrandVibe;
  if (!brandName) return "brandName is required";
  if (!industry) return "industry is required";
  if (!audience) return "audience is required";
  if (!VALID_VIBES.includes(vibe))
    return `vibe must be one of: ${VALID_VIBES.join(", ")}`;
  return { brandName, industry, audience, vibe };
}

/**
 * POST /api/generate-brand
 *
 * Drives the four-agent pipeline:
 *   Research -> Strategy -> Brand -> Content
 * Each step feeds structured context to the next. Individual agent failures
 * fall back to deterministic dummy payloads (see lib/agents.ts) so the demo
 * always returns a coherent strategy report.
 */
export async function POST(req: NextRequest) {
  const started = Date.now();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const parsed = validateInput(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }
  const input = parsed;

  // Sequential autonomous loop. Each step depends on the previous one's output.
  const research = await runResearchAgent(input);
  const strategy = await runStrategyAgent(input, research.data);
  const brand = await runBrandAgent(input, strategy.data);
  const content = await runContentAgent(input, brand.data, strategy.data);

  const usedFallback =
    research.fallback || strategy.fallback || brand.fallback || content.fallback;

  const result: PipelineResult = {
    input,
    research: research.data,
    strategy: strategy.data,
    brand: brand.data,
    content: content.data,
    meta: {
      usedFallback,
      elapsedMs: Date.now() - started,
    },
  };

  return NextResponse.json(result);
}
