/**
 * Label that highlights the unique hint prefix when nav-hint mode is active.
 *
 * Already-typed characters render dim, remaining hint characters render
 * bold, and the rest of the label renders normally. Non-matching items
 * fade to 25 % opacity.
 */
"use client";

import React from "react";

interface HintLabelProps {
  /** Full label text. */
  label: string;
  /** Computed hint prefix for this item (from `computeHints`). */
  hint: string;
  /** Characters the user has typed so far. */
  typed: string;
  /** Whether hint mode is currently active. */
  active: boolean;
  /** Whether this item does NOT match the current typed input. */
  dimmed: boolean;
  className?: string;
}

export function HintLabel({
  label,
  hint,
  typed,
  active,
  dimmed,
  className = "",
}: HintLabelProps) {
  if (!active) {
    return <span className={`truncate ${className}`}>{label}</span>;
  }

  const hintLen = hint.length;
  const hintPart = label.slice(0, hintLen);
  const rest = label.slice(hintLen);
  const typedLen = typed.length;

  return (
    <span
      className={`truncate transition-opacity duration-150 ${
        dimmed ? "opacity-25" : ""
      } ${className}`}
    >
      {/* Already-typed portion */}
      <span className="text-violet-400/50">
        {hintPart.slice(0, typedLen)}
      </span>
      {/* Remaining hint chars */}
      <span className="font-bold text-violet-300">
        {hintPart.slice(typedLen)}
      </span>
      {/* Rest of the label */}
      <span>{rest}</span>
    </span>
  );
}
