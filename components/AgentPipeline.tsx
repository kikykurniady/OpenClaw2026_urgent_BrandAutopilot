"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Check,
  FlaskConical,
  Compass,
  Palette,
  PencilLine,
} from "lucide-react";
import type { AgentDescriptor, AgentStatus } from "@/types";

const AGENTS: AgentDescriptor[] = [
  {
    id: "research",
    name: "Research Agent",
    label: "01",
    description: "Maps competitors and reads the industry landscape.",
    runningCopy: "Scanning competitors and surfacing trends…",
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    label: "02",
    description: "Finds the market gap and crafts your positioning.",
    runningCopy: "Identifying market gap and sharpening positioning…",
  },
  {
    id: "brand",
    name: "Brand Agent",
    label: "03",
    description: "Defines brand voice, tone and value propositions.",
    runningCopy: "Tuning brand voice and value propositions…",
  },
  {
    id: "content",
    name: "Content Agent",
    label: "04",
    description: "Writes 3 Instagram captions ready to post.",
    runningCopy: "Writing captions that match your voice…",
  },
];

const AGENT_ICONS = {
  research: FlaskConical,
  strategy: Compass,
  brand: Palette,
  content: PencilLine,
} as const;

interface Props {
  /** Step that the API actually completed (-1 = not started). */
  completedStep: number;
  /** True when the API request has resolved (success or fail). */
  apiDone: boolean;
  /** Called once the animation has reached the last agent. */
  onAnimationComplete: () => void;
}

/**
 * Visualizes the autonomous loop as it runs.
 *
 * The animation is decoupled from the actual API call by design:
 *  - Each agent gets a minimum on-screen time so the pipeline reads cleanly,
 *    even if the API is faster than the eye.
 *  - We never advance past an agent the API hasn't actually completed yet,
 *    so a slow response gracefully extends the running state.
 */
export function AgentPipeline({
  completedStep,
  apiDone,
  onAnimationComplete,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Progress bar for the currently-active agent.
  useEffect(() => {
    setProgress(0);
    if (activeIdx >= AGENTS.length) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const cap = completedStep >= activeIdx ? 100 : 92;
        const next = p + (cap - p) * 0.08 + 0.6;
        return Math.min(next, cap);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [activeIdx, completedStep]);

  // Advance to the next agent once: (a) its progress bar is full, AND
  // (b) the API has actually finished that step.
  useEffect(() => {
    if (activeIdx >= AGENTS.length) return;
    if (progress < 99) return;
    if (completedStep < activeIdx) return;
    const t = setTimeout(() => {
      if (activeIdx === AGENTS.length - 1) {
        if (apiDone) onAnimationComplete();
      } else {
        setActiveIdx((i) => i + 1);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [progress, completedStep, activeIdx, apiDone, onAnimationComplete]);

  const current = AGENTS[Math.min(activeIdx, AGENTS.length - 1)];

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-4">
        <span className="badge">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulseDot" />
          Autonomous pipeline running
        </span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
        AI Agents working...
      </h2>
      <p className="mt-3 text-muted text-[15px] max-w-xl">
        {current.runningCopy}
      </p>

      <div className="mt-8 grid gap-3">
        {AGENTS.map((agent, idx) => {
          const status: AgentStatus =
            idx < activeIdx
              ? "done"
              : idx === activeIdx
                ? "running"
                : "waiting";
          return (
            <AgentRow
              key={agent.id}
              agent={agent}
              status={status}
              progress={status === "running" ? progress : status === "done" ? 100 : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

function AgentRow({
  agent,
  status,
  progress,
}: {
  agent: AgentDescriptor;
  status: AgentStatus;
  progress: number;
}) {
  const Icon = AGENT_ICONS[agent.id];
  return (
    <div
      className={clsx(
        "card relative overflow-hidden transition-all duration-500",
        "px-4 sm:px-5 py-4",
        status === "waiting" && "opacity-40",
        status === "running" && "shadow-glow border-primary/45",
        status === "done" && "shadow-glow-green border-accent-green/40",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center",
            status === "done"
              ? "border-accent-green/50 bg-accent-green/10 text-accent-green"
              : status === "running"
                ? "border-primary/55 bg-primary/15 text-primary"
                : "border-border bg-white/[0.02] text-muted",
          )}
        >
          {status === "done" ? (
            <Check className="w-4 h-4" strokeWidth={3} />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="label">{agent.label}</span>
            <h3 className="font-display font-bold text-[15px] text-white truncate">
              {agent.name}
            </h3>
          </div>
          <p className="text-sm text-muted truncate">{agent.description}</p>
        </div>

        <StatusChip status={status} />
      </div>

      <div className="mt-3 h-[3px] w-full rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-[width] duration-150 ease-out relative",
            status === "done"
              ? "bg-accent-green"
              : status === "running"
                ? "bg-primary"
                : "bg-transparent",
          )}
          style={{ width: `${progress}%` }}
        >
          {status === "running" ? (
            <span className="absolute inset-0 progress-shimmer rounded-full opacity-70" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: AgentStatus }) {
  if (status === "done") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-accent-green">
        <Check className="w-3 h-3" strokeWidth={3} /> Complete
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-primary">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulseDot" />
        Analyzing…
      </span>
    );
  }
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted/70">
      <span className="w-1.5 h-1.5 rounded-full bg-muted/40" /> Waiting…
    </span>
  );
}
