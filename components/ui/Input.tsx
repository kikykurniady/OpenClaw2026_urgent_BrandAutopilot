"use client";

import clsx from "clsx";
import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";

interface FieldShellProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldShell({ label, hint, children, htmlFor }: FieldShellProps) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted/80">{hint}</span> : null}
    </label>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsx("input-field", className)}
      autoComplete="off"
      spellCheck={false}
      {...rest}
    />
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, options, ...rest }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            "input-field appearance-none pr-9 cursor-pointer",
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-bg-soft">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    );
  },
);
