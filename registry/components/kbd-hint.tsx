/**
 * A small inline badge that renders a keyboard shortcut label.
 *
 * Two sizes: `"sm"` (compact) and `"md"` (default).
 */
"use client";

import React from "react";

interface KbdHintProps {
  children: React.ReactNode;
  size?: "sm" | "md";
  /** Use "light" on dark backgrounds (default), "onPrimary" on violet/colored backgrounds. */
  variant?: "light" | "onPrimary";
}

export function KbdHint({ children, size = "md", variant = "light" }: KbdHintProps) {
  const sizeClasses =
    size === "sm" ? "text-[9px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5";

  const variantClasses =
    variant === "onPrimary"
      ? "bg-white/20 border-white/25 text-white"
      : "bg-violet-500/15 border-violet-500/20 text-violet-400";

  return (
    <kbd
      className={`rounded ${variantClasses} ${sizeClasses} font-medium inline-flex items-center justify-center leading-none`}
    >
      {children}
    </kbd>
  );
}
