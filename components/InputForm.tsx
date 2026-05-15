"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Input, Select, FieldShell } from "./ui/Input";
import type { BrandInput, BrandVibe } from "@/types";

const VIBES: BrandVibe[] = [
  "Playful",
  "Professional",
  "Bold",
  "Minimalist",
  "Luxury",
];

interface Props {
  onSubmit: (input: BrandInput) => void;
  isDemo: boolean;
}

export function InputForm({ onSubmit, isDemo }: Props) {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [vibe, setVibe] = useState<BrandVibe>("Bold");
  const [error, setError] = useState<string | null>(null);

  const valid =
    brandName.trim() && industry.trim() && audience.trim() && vibe;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError("Fill in every field — the agents need full context.");
      return;
    }
    setError(null);
    onSubmit({
      brandName: brandName.trim(),
      industry: industry.trim(),
      audience: audience.trim(),
      vibe,
    });
  }

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-5">
        <span className="badge">
          <Sparkles className="w-3 h-3" /> Powered by OpenClaw
        </span>
        {isDemo ? (
          <span className="badge !text-accent-amber border-accent-amber/30 bg-accent-amber/10">
            Demo mode
          </span>
        ) : null}
      </div>

      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">
        Build your brand in <span className="text-primary">60 seconds.</span>
      </h1>
      <p className="mt-4 text-muted text-[15px] sm:text-base max-w-xl">
        4 AI Agents. Zero agency fees. Fully autonomous.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldShell label="Brand name" htmlFor="brand-name">
          <Input
            id="brand-name"
            placeholder="e.g. Northwave"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            maxLength={48}
            required
          />
        </FieldShell>

        <FieldShell label="Industry" htmlFor="industry">
          <Input
            id="industry"
            placeholder="e.g. specialty coffee"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            maxLength={48}
            required
          />
        </FieldShell>

        <FieldShell label="Brand vibe" htmlFor="vibe">
          <Select
            id="vibe"
            value={vibe}
            onChange={(e) => setVibe(e.target.value as BrandVibe)}
            options={VIBES.map((v) => ({ label: v, value: v }))}
          />
        </FieldShell>

        <FieldShell label="Target audience" htmlFor="audience">
          <Input
            id="audience"
            placeholder="e.g. urban creatives aged 24–34"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            maxLength={80}
            required
          />
        </FieldShell>

        <div className="sm:col-span-2 flex items-center justify-between flex-wrap gap-3 pt-2">
          {error ? (
            <p className="text-sm text-accent-amber">{error}</p>
          ) : (
            <p className="text-xs text-muted/80">
              Your input feeds the Research Agent — every detail matters.
            </p>
          )}
          <Button type="submit" size="lg" disabled={!valid}>
            Generate Brand Strategy
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
