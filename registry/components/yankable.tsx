/**
 * Wrapper that marks content as yankable with a small clipboard icon.
 *
 * Shows a subtle copy symbol so users know this part of the UI has a
 * copyable value. When yank mode is active, the icon highlights and
 * the hint label appears.
 */
"use client";

import React from "react";

interface YankableProps {
  children: React.ReactNode;
  /** Whether yank mode is currently active. */
  active?: boolean;
  /** Whether this item matches the current typed input. */
  matching?: boolean;
  className?: string;
}

export function Yankable({
  children,
  active = false,
  matching = true,
  className = "",
}: YankableProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${
        active && !matching ? "opacity-25" : ""
      } ${className}`}
    >
      {children}
      <svg
        className={`h-3 w-3 shrink-0 transition-colors duration-150 ${
          active
            ? matching
              ? "text-amber-400"
              : "text-zinc-600"
            : "text-zinc-600"
        }`}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 5.5V3.5a1.5 1.5 0 00-1.5-1.5H3.5A1.5 1.5 0 002 3.5V9a1.5 1.5 0 001.5 1.5h2" />
      </svg>
    </span>
  );
}
