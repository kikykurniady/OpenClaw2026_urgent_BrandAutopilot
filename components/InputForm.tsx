"use client";

import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Timer,
  Layers,
  MessageSquareQuote,
} from "lucide-react";
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

interface Preset {
  emoji: string;
  label: string;
  values: BrandInput;
}

const PRESETS: Preset[] = [
  {
    emoji: "☕",
    label: "Specialty coffee",
    values: {
      brandName: "Northwave",
      industry: "specialty coffee",
      audience: "urban creatives aged 24–34",
      vibe: "Bold",
    },
  },
  {
    emoji: "🧘",
    label: "Wellness app",
    values: {
      brandName: "Stillpoint",
      industry: "meditation & wellness",
      audience: "burnt-out knowledge workers",
      vibe: "Minimalist",
    },
  },
  {
    emoji: "👟",
    label: "Streetwear",
    values: {
      brandName: "Reverb",
      industry: "streetwear & sneakers",
      audience: "Gen Z trendsetters in SEA cities",
      vibe: "Playful",
    },
  },
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

  function applyPreset(preset: Preset) {
    setBrandName(preset.values.brandName);
    setIndustry(preset.values.industry);
    setAudience(preset.values.audience);
    setVibe(preset.values.vibe);
    setError(null);
  }

  return (
    <div className="animate-fadeUp">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
        {/* ---------------- Hero column ---------------- */}
        <div>
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="badge">
              <Sparkles className="w-3 h-3" /> Powered by OpenClaw
            </span>
            {isDemo ? (
              <span className="badge !text-accent-amber border-accent-amber/30 bg-accent-amber/10">
                Demo mode
              </span>
            ) : null}
            <span className="badge !text-accent-green border-accent-green/30 bg-accent-green/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulseDot" />
              4 agents online
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-[3.25rem] font-extrabold tracking-tight leading-[1.02] text-white">
            Build your brand in{" "}
            <span className="text-primary">60 seconds.</span>
          </h1>
          <p className="mt-4 text-muted text-[15px] sm:text-base max-w-xl leading-relaxed">
            4 AI Agents work in an autonomous loop — research the market, find
            your gap, craft your voice, and write content you can post today.
            Zero agency fees.
          </p>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-3 gap-2 max-w-md">
            <Stat icon={<Layers className="w-3.5 h-3.5" />} value="4" label="agents" />
            <Stat icon={<Timer className="w-3.5 h-3.5" />} value="~60s" label="full pipeline" />
            <Stat
              icon={<MessageSquareQuote className="w-3.5 h-3.5" />}
              value="3"
              label="captions"
            />
          </div>

          {/* ---------------- Form ---------------- */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
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

            {/* Preset chips */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="label inline-flex items-center gap-1.5">
                  <Wand2 className="w-3 h-3" /> Try a preset
                </span>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-full border border-border bg-white/[0.03] text-white/80 hover:bg-white/[0.07] hover:border-border-strong transition"
                  >
                    <span aria-hidden>{p.emoji}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between flex-wrap gap-3 pt-1">
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

        {/* ---------------- Preview column ---------------- */}
        <PipelinePreview />
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="card !p-3 flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/25 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="font-display font-bold text-white text-sm">{value}</div>
        <div className="text-[10.5px] uppercase tracking-wider text-muted">
          {label}
        </div>
      </div>
    </div>
  );
}

/**
 * Static decorative preview of the agent pipeline — gives the empty
 * landing state visual weight without animating the user away from the
 * form.
 */
function PipelinePreview() {
  const steps = [
    { tag: "01", name: "Research", note: "Scans 3+ competitors", color: "primary" },
    { tag: "02", name: "Strategy", note: "Finds your market gap", color: "blue" },
    { tag: "03", name: "Brand", note: "Crafts voice & tone", color: "amber" },
    { tag: "04", name: "Content", note: "Writes 3 captions", color: "green" },
  ] as const;

  const colorMap: Record<string, string> = {
    primary: "text-primary border-primary/40 bg-primary/10",
    blue: "text-accent-blue border-accent-blue/40 bg-accent-blue/10",
    amber: "text-accent-amber border-accent-amber/40 bg-accent-amber/10",
    green: "text-accent-green border-accent-green/40 bg-accent-green/10",
  };

  return (
    <div className="hidden lg:block sticky top-8">
      <div className="card !p-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative">
          <span className="label">Autonomous loop</span>
          <span className="badge !text-[10px]">Live preview</span>
        </div>

        <div className="relative">
          {/* connector line */}
          <span className="absolute left-[17px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/60 via-border to-accent-green/60" />
          <ul className="space-y-3 relative">
            {steps.map((s) => (
              <li key={s.tag} className="flex items-center gap-3">
                <div
                  className={`relative z-10 shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center font-display font-bold text-[11px] ${colorMap[s.color]}`}
                >
                  {s.tag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-white text-[13.5px] leading-tight">
                    {s.name} Agent
                  </div>
                  <div className="text-xs text-muted truncate">{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted/80 leading-relaxed">
          Each agent passes structured JSON to the next — a tiny multi-agent
          system, not a single mega-prompt.
        </div>
      </div>
    </div>
  );
}
