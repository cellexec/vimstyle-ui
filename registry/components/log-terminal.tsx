/**
 * Terminal-style log viewer with traffic-light header chrome,
 * line variants, and smart auto-scroll.
 *
 * Auto-scrolls to bottom as new lines arrive, but pauses when the
 * user scrolls up. Resumes when they scroll back to the bottom.
 */
"use client";

import React, { useRef, useEffect, useCallback } from "react";

export interface LogLine {
  id: string;
  text: string;
  variant?: "default" | "error" | "warning" | "info" | "dim";
  timestamp?: string;
}

interface LogTerminalProps {
  /** Log lines to display. */
  lines: LogLine[];
  /** Terminal title shown in the header. */
  title?: string;
  /** Maximum height. Default "400px". */
  maxHeight?: string;
  /** Action buttons rendered in the header. */
  actions?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: "text-zinc-300",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
  dim: "text-zinc-600",
};

export function LogTerminal({
  lines,
  title = "Terminal",
  maxHeight = "400px",
  actions,
}: LogTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Stick to bottom if within 40px of the end
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  // Auto-scroll when new lines arrive (if stuck to bottom)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines.length]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950">
      {/* Header with traffic lights */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-[10px] w-[10px] rounded-full bg-red-500/80" />
            <span className="h-[10px] w-[10px] rounded-full bg-yellow-500/80" />
            <span className="h-[10px] w-[10px] rounded-full bg-green-500/80" />
          </div>
          <span className="text-[11px] font-medium text-zinc-500">
            {title}
          </span>
          <span className="text-[10px] text-zinc-600">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
          </span>
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Log lines */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
        style={{ maxHeight }}
      >
        {lines.length === 0 ? (
          <p className="text-zinc-600">No output yet...</p>
        ) : (
          lines.map((line) => (
            <div key={line.id} className="flex gap-3">
              {line.timestamp && (
                <span className="shrink-0 select-none text-zinc-600">
                  {line.timestamp}
                </span>
              )}
              <span className={variantClasses[line.variant ?? "default"]}>
                {line.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
