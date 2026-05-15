"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[0_0_0_1px_rgba(124,92,252,0.6),0_8px_28px_-8px_rgba(124,92,252,0.7)] hover:bg-[#8b6dff] hover:shadow-[0_0_0_1px_rgba(124,92,252,0.75),0_10px_36px_-8px_rgba(124,92,252,0.85)]",
  secondary:
    "bg-white/[0.04] text-white border border-border hover:bg-white/[0.07]",
  ghost: "text-white/80 hover:text-white hover:bg-white/[0.04]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-[15px] rounded-[10px]",
  lg: "h-12 px-6 text-[15px] rounded-[10px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
