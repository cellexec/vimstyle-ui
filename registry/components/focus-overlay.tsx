/**
 * Near-full-screen overlay for immersive panels (chat, history, etc.).
 *
 * Adds a `data-overlay-open` attribute to the backdrop so other keyboard
 * handlers can detect when an overlay is active. Closes on Esc.
 */
"use client";

import React, { useEffect } from "react";
import { KbdHint } from "@/components/kbd-hint";

interface FocusOverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function FocusOverlay({
  open,
  onClose,
  title,
  icon,
  children,
}: FocusOverlayProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-overlay-open
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="text-violet-400">{icon}</span>
            )}
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            Close
            <KbdHint size="sm">Esc</KbdHint>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
