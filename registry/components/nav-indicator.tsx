/**
 * Floating indicator that appears when nav-hint mode is active.
 *
 * Shows the mode label, typed characters with a blinking cursor,
 * and an Esc hint. Fixed to the bottom-center of the viewport.
 */
"use client";

import React from "react";

interface NavIndicatorProps {
  /** Whether hint mode is active. Hidden when false. */
  active: boolean;
  /** Characters typed so far. */
  typed: string;
  /** Mode label shown on the left. Default "SPACE NAV". */
  label?: string;
}

export function NavIndicator({
  active,
  typed,
  label = "SPACE NAV",
}: NavIndicatorProps) {
  if (!active) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-zinc-900/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm">
        <span className="font-medium text-violet-400">{label}</span>
        {typed ? (
          <span className="font-mono text-violet-300">
            {typed}
            <span className="animate-pulse">_</span>
          </span>
        ) : (
          <span className="text-zinc-500">type to jump...</span>
        )}
        <span className="text-zinc-600">Esc to cancel</span>
      </div>
    </div>
  );
}
