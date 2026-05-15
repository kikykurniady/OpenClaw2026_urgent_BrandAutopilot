export type BrandVibe = "Playful" | "Professional" | "Bold" | "Minimalist" | "Luxury";

export interface BrandInput {
  brandName: string;
  industry: string;
  audience: string;
  vibe: BrandVibe;
}

export interface ResearchOutput {
  competitors: string[];
  industryLandscape: string;
  keyTrends: string[];
}

export interface StrategyOutput {
  marketGap: string;
  positioningStatement: string;
  competitiveAdvantage: string;
}

export interface BrandOutput {
  brandVoice: string[];
  valueProps: string[];
  toneGuide: string;
}

export interface ContentOutput {
  captions: string[];
}

export interface PipelineResult {
  input: BrandInput;
  research: ResearchOutput;
  strategy: StrategyOutput;
  brand: BrandOutput;
  content: ContentOutput;
  meta: {
    usedFallback: boolean;
    elapsedMs: number;
  };
}

export type AgentId = "research" | "strategy" | "brand" | "content";
export type AgentStatus = "waiting" | "running" | "done";

export interface AgentDescriptor {
  id: AgentId;
  name: string;
  label: string;
  description: string;
  runningCopy: string;
}
