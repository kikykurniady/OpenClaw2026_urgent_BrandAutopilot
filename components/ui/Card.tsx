"use client";

import clsx from "clsx";
import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  glow?: "none" | "primary" | "green";
  padded?: boolean;
}

export function Card({
  className,
  glow = "none",
  padded = true,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        "card",
        padded && "p-5 sm:p-6",
        glow === "primary" && "shadow-glow border-primary/40",
        glow === "green" && "shadow-glow-green border-accent-green/40",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-3">
      <div>
        {eyebrow ? <div className="label mb-1.5">{eyebrow}</div> : null}
        <h3 className="font-display text-[17px] sm:text-lg font-bold text-white leading-tight">
          {title}
        </h3>
      </div>
      {right}
    </div>
  );
}
