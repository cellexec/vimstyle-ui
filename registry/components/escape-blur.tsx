/**
 * Global Escape key handler that blurs any focused input, textarea,
 * or select element. Essential for vim-style UX where Escape always
 * returns you to normal mode.
 *
 * Mount once in your root layout — it handles everything.
 */
"use client";

import { useEffect } from "react";

export function EscapeBlur() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = document.activeElement as HTMLElement | null;
      if (!el) return;

      const tag = el.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      ) {
        e.preventDefault();
        el.blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
