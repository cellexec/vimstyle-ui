/**
 * Premium showcase wrapper for interactive component demos.
 *
 * Wraps demo content with a labeled header and inset demo area.
 * The ? kbd button blurs the demo and overlays keyboard hints as a
 * centered popover. Pressing any listed key dismisses the overlay.
 */
"use client";

import React, { useState, useEffect, useCallback } from "react";

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

  // Collect all hint keys for dismissal
  const allKeys = hints
    ? hints.flatMap((h) => (Array.isArray(h.keys) ? h.keys : [h.keys]))
    : [];

  const dismiss = useCallback(() => setHintsOpen(false), []);

  // Toggle on ? key, dismiss on any listed key or Escape
  useEffect(() => {
    if (!hints || hints.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (isInput || (e.target as HTMLElement)?.isContentEditable) return;

      if (!hintsOpen) {
        if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setHintsOpen(true);
        }
        return;
      }

      if (
        e.key === "Escape" ||
        e.key === "?" ||
        allKeys.some((k) => k.toLowerCase() === e.key.toLowerCase())
      ) {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [hintsOpen, hints, allKeys, dismiss]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (!hintsOpen) return;
    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  }, [hintsOpen, dismiss]);

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

        {/* Inset demo area */}
        <div className="px-5 pb-5">
          <div
            className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 ${className}`}
          >
            {/* Demo content — blurs when hints overlay is open */}
            <div
              className={`transition-all duration-200 ${
                hintsOpen
                  ? "pointer-events-none blur-[6px] brightness-50"
                  : ""
              }`}
            >
              {children}
            </div>

            {/* Hints popover overlay */}
            {hintsOpen && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                onClick={dismiss}
              >
                <div
                  className="rounded-xl border border-violet-500/20 bg-zinc-900/95 px-6 py-5 shadow-2xl backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                    Keyboard shortcuts
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {hints!.map((hint, i) => {
                      const keys = Array.isArray(hint.keys)
                        ? hint.keys
                        : [hint.keys];
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-6"
                        >
                          <span className="text-[12px] text-zinc-300">
                            {hint.label}
                          </span>
                          <span className="flex items-center gap-1.5">
                            {keys.map((key, ki) => (
                              <React.Fragment key={ki}>
                                {ki > 0 && (
                                  <span className="text-[9px] text-zinc-600">
                                    /
                                  </span>
                                )}
                                <kbd className="inline-flex min-w-[22px] items-center justify-center rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-1 font-mono text-[11px] font-medium leading-none text-violet-300">
                                  {key}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-center text-[10px] text-zinc-600">
                    press any key or click to dismiss
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
