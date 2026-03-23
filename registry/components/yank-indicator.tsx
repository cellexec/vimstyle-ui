/**
 * Floating indicator for yank (copy) mode.
 *
 * Shows "YANK" with typed characters while active, then briefly
 * flashes "Copied: <label>" when a value is yanked.
 */
"use client";

import React from "react";
import type { YankTarget } from "@/hooks/use-yank-mode";

interface YankIndicatorProps {
  /** Whether yank mode is currently active. */
  active: boolean;
  /** Characters typed so far. */
  typed: string;
  /** The most recently yanked target (shown as confirmation). */
  lastYanked: YankTarget | null;
}

export function YankIndicator({
  active,
  typed,
  lastYanked,
}: YankIndicatorProps) {
  if (!active && !lastYanked) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2">
      {active ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-zinc-900/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm">
          <span className="font-medium text-amber-400">YANK</span>
          {typed ? (
            <span className="font-mono text-amber-300">
              {typed}
              <span className="animate-pulse">_</span>
            </span>
          ) : (
            <span className="text-zinc-500">type to copy...</span>
          )}
          <span className="text-zinc-600">Esc to cancel</span>
        </div>
      ) : lastYanked ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-zinc-900/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm">
          <span className="font-medium text-green-400">Copied</span>
          <span className="max-w-[200px] truncate text-zinc-300">
            {lastYanked.label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
