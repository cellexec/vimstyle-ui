/**
 * Premium showcase wrapper for interactive component demos.
 *
 * Wraps demo content with a labeled header, gradient border effect,
 * and an expandable keyboard hints panel triggered by a ? icon.
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
    <div className="not-prose my-8">
      {/* Outer glow border */}
      <div className="rounded-2xl bg-gradient-to-b from-violet-500/[0.15] via-violet-500/[0.05] to-transparent p-px">
        <div className="rounded-2xl bg-zinc-950">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
            <div className="flex items-center gap-2">
              {/* Three dots */}
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                Showcase
              </span>
            </div>

            {hints && hints.length > 0 && (
              <button
                onClick={() => setHintsOpen((o) => !o)}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                  hintsOpen
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
                aria-label={hintsOpen ? "Hide keyboard hints" : "Show keyboard hints"}
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
                  <circle cx="8" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                <span>kbd</span>
              </button>
            )}
          </div>

          {/* Expandable hints panel */}
          {hints && hintsOpen && (
            <div className="border-b border-white/[0.06] bg-violet-500/[0.03] px-4 py-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {hints.map((hint, i) => {
                  const keys = Array.isArray(hint.keys)
                    ? hint.keys
                    : [hint.keys];
                  return (
                    <span key={i} className="flex items-center gap-1.5">
                      {keys.map((key, ki) => (
                        <React.Fragment key={ki}>
                          {ki > 0 && (
                            <span className="text-[9px] text-zinc-600">
                              /
                            </span>
                          )}
                          <kbd className="inline-flex items-center justify-center rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-violet-300">
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

          {/* Demo content */}
          <div className={`relative overflow-hidden ${className}`}>
            {children}
          </div>

          {/* Bottom gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
