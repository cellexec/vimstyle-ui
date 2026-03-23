/**
 * Floating keyboard hints bar for the docs site.
 *
 * Shows available keybindings at the bottom of the viewport so readers
 * discover the keyboard-first navigation. Uses the KbdHint component
 * from the registry — the docs are built with the same components
 * they document.
 */
"use client";

import React, { useState, useEffect } from "react";
import { KbdHint } from "@/components/kbd-hint";

export function DocsHints() {
  const [visible, setVisible] = useState(true);

  // Hide after 8 seconds of no keyboard activity, show again on key press
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onKey = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 8000);
    };

    // Start the initial hide timer
    timer = setTimeout(() => setVisible(false), 8000);

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t border-white/[0.06] bg-zinc-950/90 px-4 py-1.5 backdrop-blur-sm transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">j</KbdHint>
        <KbdHint size="sm">k</KbdHint>
        <span className="text-[11px] text-zinc-500">navigate</span>
      </span>
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">/</KbdHint>
        <span className="text-[11px] text-zinc-500">search</span>
      </span>
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">Enter</KbdHint>
        <span className="text-[11px] text-zinc-500">open</span>
      </span>
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">Space</KbdHint>
        <span className="text-[11px] text-zinc-500">jump</span>
      </span>
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">y</KbdHint>
        <span className="text-[11px] text-zinc-500">yank</span>
      </span>
      <span className="flex items-center gap-1.5">
        <KbdHint size="sm">Esc</KbdHint>
        <span className="text-[11px] text-zinc-500">back</span>
      </span>
    </div>
  );
}
