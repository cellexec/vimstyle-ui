/**
 * Premium showcase wrapper for interactive component demos.
 *
 * Wraps demo content with a labeled header, inset demo area with clear
 * visual separation, and an expandable keyboard hints panel.
 */
"use client";

import React, { useState } from "react";

interface KeyHint {
  keys: string | string[];
  label: string;
}

interface ShowcaseProps {
  children: React.ReactNode;
  /** Keyboard hints available in this showcase. */
  hints?: KeyHint[];
  className?: string;
}

export function Showcase({ children, hints, className = "" }: ShowcaseProps) {
  const [hintsOpen, setHintsOpen] = useState(false);

  return (
    <div className="not-prose my-10">
      {/* Outer shell */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/50 shadow-[0_0_40px_-12px_rgba(139,92,246,0.08)]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-[9px] w-[9px] rounded-full bg-zinc-700/80" />
              <span className="h-[9px] w-[9px] rounded-full bg-zinc-700/80" />
              <span className="h-[9px] w-[9px] rounded-full bg-zinc-700/80" />
            </div>
            <div className="h-4 w-px bg-white/[0.06]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Showcase
            </span>
          </div>

          {hints && hints.length > 0 && (
            <button
              onClick={() => setHintsOpen((o) => !o)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] transition-all ${
                hintsOpen
                  ? "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
              aria-label={
                hintsOpen ? "Hide keyboard hints" : "Show keyboard hints"
              }
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6.5" />
                <path d="M6.5 6.5a1.5 1.5 0 1 1 1.5 1.5v1" />
                <circle
                  cx="8"
                  cy="11.5"
                  r="0.5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              <span>kbd</span>
            </button>
          )}
        </div>

        {/* Expandable hints panel */}
        {hints && hintsOpen && (
          <div className="mx-5 mb-3 rounded-lg border border-violet-500/10 bg-violet-500/[0.04] px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {hints.map((hint, i) => {
                const keys = Array.isArray(hint.keys)
                  ? hint.keys
                  : [hint.keys];
                return (
                  <span key={i} className="flex items-center gap-1.5">
                    {keys.map((key, ki) => (
                      <React.Fragment key={ki}>
                        {ki > 0 && (
                          <span className="text-[9px] text-zinc-600">/</span>
                        )}
                        <kbd className="inline-flex items-center justify-center rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-violet-300">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                    <span className="text-[11px] text-zinc-400">
                      {hint.label}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Inset demo area */}
        <div className="px-5 pb-5">
          <div
            className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 ${className}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
