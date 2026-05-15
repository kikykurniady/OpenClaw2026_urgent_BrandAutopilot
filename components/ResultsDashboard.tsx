"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Quote,
  Target,
  Megaphone,
  Users,
  Tag,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import type { PipelineResult } from "@/types";

interface Props {
  result: PipelineResult;
  onReset: () => void;
}

export function ResultsDashboard({ result, onReset }: Props) {
  const { input, research, strategy, brand, content, meta } = result;

  function handleExport() {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${input.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-strategy.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ---------- Hero summary ---------- */}
      <Card padded={false} className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-accent-blue/10 blur-3xl pointer-events-none" />

        <div className="relative p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge !text-accent-green border-accent-green/30 bg-accent-green/10">
                  <Sparkles className="w-3 h-3" /> Strategy ready
                </span>
                <span className="badge">
                  {(meta.elapsedMs / 1000).toFixed(1)}s · 4 agents
                </span>
                {meta.usedFallback ? (
                  <span className="badge !text-accent-amber border-accent-amber/30 bg-accent-amber/10">
                    Fallback data
                  </span>
                ) : null}
              </div>
              <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-white leading-[1.05]">
                {input.brandName}
              </h2>
              <p className="mt-2 text-[15px] text-white/80 max-w-2xl leading-relaxed">
                {strategy.positioningStatement}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <SummaryChip icon={<Tag className="w-3 h-3" />} label="Industry" value={input.industry} />
                <SummaryChip icon={<Sparkles className="w-3 h-3" />} label="Vibe" value={input.vibe} accent />
                <SummaryChip icon={<Users className="w-3 h-3" />} label="Audience" value={input.audience} />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download className="w-3.5 h-3.5" /> Export JSON
              </Button>
              <Button variant="secondary" size="sm" onClick={onReset}>
                <RotateCcw className="w-3.5 h-3.5" /> New brand
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover">
          <CardHeader
            eyebrow="Strategy · 02"
            title="Brand positioning"
            right={<Target className="w-4 h-4 text-primary" />}
          />
          <p className="text-[15px] text-white/85 leading-relaxed">
            {strategy.positioningStatement}
          </p>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            <span className="text-white/70 font-medium">Edge — </span>
            {strategy.competitiveAdvantage}
          </p>
        </Card>

        <Card className="card-hover">
          <CardHeader
            eyebrow="Research · 01"
            title="Market gap"
            right={<Megaphone className="w-4 h-4 text-accent-blue" />}
          />
          <p className="text-[15px] text-white/85 leading-relaxed">
            {strategy.marketGap}
          </p>
          <div className="mt-4">
            <div className="label mb-2">Tracked competitors</div>
            <div className="flex flex-wrap gap-1.5">
              {research.competitors.map((c) => (
                <span key={c} className="pill !text-xs">
                  vs. {c}
                </span>
              ))}
            </div>
          </div>
          {research.keyTrends?.length ? (
            <div className="mt-4">
              <div className="label mb-2">Key trends</div>
              <ul className="space-y-1.5 text-sm text-white/80">
                {research.keyTrends.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-accent-blue" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-2 card-hover">
          <CardHeader eyebrow="Brand · 03" title="Brand voice" />
          <div className="flex flex-wrap gap-2">
            {brand.brandVoice.map((adj) => (
              <span
                key={adj}
                className="pill border-primary/30 bg-primary/10 text-white"
              >
                {adj}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted leading-relaxed">
            <span className="text-white/70 font-medium">Tone guide — </span>
            {brand.toneGuide}
          </p>
        </Card>

        <Card className="md:col-span-3 card-hover">
          <CardHeader eyebrow="Brand · 03" title="Value propositions" />
          <ul className="space-y-3">
            {brand.valueProps.map((prop, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] text-white/90 leading-relaxed"
              >
                <span className="shrink-0 mt-1 w-5 h-5 rounded-md bg-primary/15 border border-primary/30 text-primary font-display font-bold text-[11px] flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="label mb-1">Content · 04</div>
            <h3 className="font-display text-xl font-bold text-white">
              Social media captions
            </h3>
          </div>
          <span className="text-xs text-muted">3 ready to post · Instagram</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.captions.map((caption, i) => (
            <CaptionCard key={i} caption={caption} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full border ${
        accent
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-white/[0.03]"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          accent ? "text-primary" : "text-muted"
        }`}
      >
        {icon}
      </span>
      <span className="text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="text-[13px] font-medium text-white truncate max-w-[180px]">
        {value}
      </span>
    </div>
  );
}

function CaptionCard({ caption, index }: { caption: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const tags = ["Emotional", "Educational", "Promotional"];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard might be blocked — silently ignore, UI stays usable
    }
  }

  return (
    <Card className="flex flex-col card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="badge">
          <Quote className="w-3 h-3" /> Caption {index + 1} · {tags[index] ?? "Post"}
        </span>
      </div>
      <p className="flex-1 text-[14.5px] text-white/90 leading-relaxed whitespace-pre-wrap">
        {caption}
      </p>
      <button
        onClick={handleCopy}
        className="mt-4 inline-flex items-center justify-center gap-1.5 self-start h-8 px-3 text-xs font-medium rounded-md border border-border bg-white/[0.04] text-white/85 hover:bg-white/[0.08] transition"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-accent-green" strokeWidth={3} /> Copied!
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" /> Copy
          </>
        )}
      </button>
    </Card>
  );
}
