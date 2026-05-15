"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Quote, Target, Megaphone } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import type { PipelineResult } from "@/types";

interface Props {
  result: PipelineResult;
  onReset: () => void;
}

export function ResultsDashboard({ result, onReset }: Props) {
  const { input, research, strategy, brand, content, meta } = result;

  return (
    <div className="animate-fadeUp space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="label mb-1.5">Strategy report</div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {input.brandName} <span className="text-muted">—</span>{" "}
            <span className="text-primary">{input.vibe}</span>{" "}
            <span className="text-white/85">in {input.industry}</span>
          </h2>
          <p className="mt-2 text-muted text-sm">
            Generated in {(meta.elapsedMs / 1000).toFixed(1)}s by 4 autonomous agents
            {meta.usedFallback ? (
              <span className="ml-2 badge !text-accent-amber border-accent-amber/30 bg-accent-amber/10">
                Fallback data used
              </span>
            ) : null}
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={onReset}>
          <RotateCcw className="w-4 h-4" /> New brand
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            eyebrow="Strategy"
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

        <Card>
          <CardHeader
            eyebrow="Research"
            title="Market gap"
            right={<Megaphone className="w-4 h-4 text-accent-blue" />}
          />
          <p className="text-[15px] text-white/85 leading-relaxed">
            {strategy.marketGap}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {research.competitors.map((c) => (
              <span key={c} className="pill !text-xs">
                vs. {c}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Brand" title="Brand voice" />
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

      <Card>
        <CardHeader eyebrow="Brand" title="Value propositions" />
        <ul className="space-y-3">
          {brand.valueProps.map((prop, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-white/90 leading-relaxed">
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="label mb-1">Content</div>
            <h3 className="font-display text-xl font-bold text-white">
              Social media captions
            </h3>
          </div>
          <span className="text-xs text-muted">3 ready to post</span>
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
