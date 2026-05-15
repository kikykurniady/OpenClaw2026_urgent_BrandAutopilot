"use client";

import { useEffect, useState } from "react";
import { Bot, Github } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { AgentPipeline } from "@/components/AgentPipeline";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import {
  fallbackBrand,
  fallbackContent,
  fallbackResearch,
  fallbackStrategy,
} from "@/lib/agents";
import type { BrandInput, PipelineResult } from "@/types";

type Screen = "input" | "loading" | "results";

/**
 * Minimum on-screen time per agent in milliseconds — keeps the pipeline
 * legible to a hackathon audience even when the API responds in <2s.
 */
const STEP_MIN_MS = 1400;

export default function Page() {
  const [screen, setScreen] = useState<Screen>("input");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedStep, setCompletedStep] = useState(-1);
  const [apiDone, setApiDone] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setIsDemo(params.get("demo") === "true");
  }, []);

  async function handleSubmit(input: BrandInput) {
    setError(null);
    setResult(null);
    setCompletedStep(-1);
    setApiDone(false);
    setScreen("loading");

    if (isDemo) {
      // Demo mode: simulate the pipeline with deterministic dummy data.
      runDemoPipeline(input);
      return;
    }

    // Real pipeline + paced "step completed" UX feedback.
    // The API does all four agents in a single request — we artificially
    // tick `completedStep` forward at a steady pace so the UI animation
    // can stay in sync with what the user expects to see.
    const tickInterval = STEP_MIN_MS;
    let tick = 0;
    const ticker = setInterval(() => {
      tick += 1;
      setCompletedStep((c) => Math.max(c, Math.min(tick - 1, 2)));
    }, tickInterval);

    try {
      const res = await fetch("/api/generate-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as PipelineResult;
      setResult(data);
      setCompletedStep(3);
      setApiDone(true);
    } catch (err) {
      clearInterval(ticker);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      // Even on hard failure we still show a complete report using fallbacks
      // so the demo never collapses mid-flow.
      const fallback = buildFallbackResult(input);
      setResult(fallback);
      setCompletedStep(3);
      setApiDone(true);
    } finally {
      clearInterval(ticker);
    }
  }

  function runDemoPipeline(input: BrandInput) {
    let step = 0;
    const interval = setInterval(() => {
      setCompletedStep(step);
      step += 1;
      if (step >= 4) {
        clearInterval(interval);
        setResult(buildFallbackResult(input, /*demo*/ true));
        setApiDone(true);
      }
    }, STEP_MIN_MS);
  }

  function handleAnimationComplete() {
    if (result) setScreen("results");
  }

  function handleReset() {
    setScreen("input");
    setResult(null);
    setError(null);
    setCompletedStep(-1);
    setApiDone(false);
  }

  return (
    <main className="min-h-screen px-5 sm:px-8 pt-8 sm:pt-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <Header />
        <div className="mt-10 sm:mt-14">
          {screen === "input" && (
            <InputForm onSubmit={handleSubmit} isDemo={isDemo} />
          )}
          {screen === "loading" && (
            <AgentPipeline
              completedStep={completedStep}
              apiDone={apiDone}
              onAnimationComplete={handleAnimationComplete}
            />
          )}
          {screen === "results" && result && (
            <>
              {error ? (
                <div className="mb-6 card border-accent-amber/40 bg-accent-amber/[0.06] text-sm text-accent-amber px-4 py-3">
                  Live pipeline failed ({error}) — showing fallback strategy so
                  you can still demo.
                </div>
              ) : null}
              <ResultsDashboard result={result} onReset={handleReset} />
            </>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center shadow-glow">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <span className="font-display font-extrabold text-lg tracking-tight text-white">
          BrandAutopilot
        </span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition"
        >
          <Github className="w-3.5 h-3.5" /> Source
        </a>
        <span className="badge">OpenClaw Agenthon 2026</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 text-xs text-muted/70 flex items-center justify-between flex-wrap gap-2">
      <span>
        4 autonomous agents · Research → Strategy → Brand → Content
      </span>
      <span>Built with Claude · OpenRouter · Next.js</span>
    </footer>
  );
}

function buildFallbackResult(input: BrandInput, demo = false): PipelineResult {
  const research = fallbackResearch(input);
  const strategy = fallbackStrategy(input);
  const brand = fallbackBrand(input);
  const content = fallbackContent(input);
  return {
    input,
    research,
    strategy,
    brand,
    content,
    meta: {
      usedFallback: !demo,
      elapsedMs: 4 * STEP_MIN_MS,
    },
  };
}
