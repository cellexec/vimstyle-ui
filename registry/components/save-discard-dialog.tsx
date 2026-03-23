/**
 * Three-action dialog for unsaved changes: Save (Enter), Discard (q), Cancel (Esc).
 *
 * Adds `data-overlay-open` so global keyboard shortcuts are suppressed.
 */
"use client";

import React, { useEffect } from "react";
import { KbdHint } from "@/components/kbd-hint";

interface SaveDiscardDialogProps {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export function SaveDiscardDialog({
  open,
  onSave,
  onDiscard,
  onCancel,
  title = "Unsaved changes",
  description = "You have unsaved changes. What would you like to do?",
}: SaveDiscardDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        onSave();
      } else if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        e.stopPropagation();
        onDiscard();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onSave, onDiscard, onCancel]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-overlay-open
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              Cancel
              <KbdHint size="sm">Esc</KbdHint>
            </button>
            <button
              onClick={onDiscard}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/[0.08] hover:bg-red-500/[0.15] border border-red-500/20 transition-colors"
            >
              Discard
              <KbdHint size="sm">q</KbdHint>
            </button>
            <button
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors"
            >
              Save
              <KbdHint size="sm">Enter</KbdHint>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
