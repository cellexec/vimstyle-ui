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
}

export function KbdHint({ children, size = "md" }: KbdHintProps) {
  const sizeClasses =
    size === "sm" ? "text-[9px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5";

  return (
    <kbd
      className={`rounded bg-violet-500/15 border border-violet-500/20 ${sizeClasses} font-medium text-violet-400 inline-flex items-center justify-center leading-none`}
    >
      {children}
    </kbd>
  );
}
