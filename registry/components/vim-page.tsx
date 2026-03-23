/**
 * Full-page layout wrapper with a header, scrollable content area,
 * and a bottom hints bar that shows available keyboard shortcuts.
 */
"use client";

import React from "react";
import { KbdHint } from "@/components/kbd-hint";

interface HintDef {
  keys: string | string[];
  label: string;
}

interface VimPageProps {
  title: string;
  subtitle?: string;
  hints?: HintDef[];
  children: React.ReactNode;
}

export function VimPage({ title, subtitle, hints, children }: VimPageProps) {
  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] bg-zinc-950 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden p-8">{children}</div>

      {/* Bottom hints bar */}
      {hints && hints.length > 0 && (
        <div className="shrink-0 border-t border-white/[0.06] bg-zinc-950 px-6 py-2 flex items-center gap-4 text-[11px] text-zinc-600">
          {hints.map((hint, i) => {
            const keys = Array.isArray(hint.keys) ? hint.keys : [hint.keys];
            return (
              <div key={i} className="flex items-center gap-1.5">
                {keys.map((k, ki) => (
                  <KbdHint key={ki} size="sm">
                    {k}
                  </KbdHint>
                ))}
                <span>{hint.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
