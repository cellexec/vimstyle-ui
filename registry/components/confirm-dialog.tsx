/**
 * Centered confirmation dialog with Enter to confirm and Esc to cancel.
 *
 * Adds `data-overlay-open` so global keyboard shortcuts are suppressed
 * while the dialog is visible.
 */
"use client";

import React, { useEffect } from "react";
import { KbdHint } from "@/components/kbd-hint";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}: ConfirmDialogProps) {
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
        onConfirm();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onConfirm, onCancel]);

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
              onClick={onConfirm}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors"
            >
              Confirm
              <KbdHint size="sm">Enter</KbdHint>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
