/**
 * Hover tooltip that positions itself dynamically relative to the
 * trigger element using getBoundingClientRect.
 *
 * Renders a fixed-position label offset from the trigger's right edge.
 */
"use client";

import React, { useState, useRef } from "react";

interface TooltipProps {
  /** Tooltip text. */
  label: string;
  /** Trigger element. */
  children: React.ReactNode;
  /** Position relative to trigger. Default "right". */
  side?: "right" | "top" | "bottom";
}

export function Tooltip({ label, children, side = "right" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    switch (side) {
      case "right":
        setPos({ top: r.top + r.height / 2, left: r.right + 8 });
        break;
      case "top":
        setPos({ top: r.top - 8, left: r.left + r.width / 2 });
        break;
      case "bottom":
        setPos({ top: r.bottom + 8, left: r.left + r.width / 2 });
        break;
    }
    setShow(true);
  };

  const translateClass =
    side === "right"
      ? "-translate-y-1/2"
      : "-translate-x-1/2";

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={() => setShow(false)}
      className="relative"
    >
      {children}
      {show && (
        <div
          role="tooltip"
          className={`pointer-events-none fixed z-50 whitespace-nowrap rounded-md border border-white/[0.08] bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 shadow-lg ${translateClass}`}
          style={{ top: pos.top, left: pos.left }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
