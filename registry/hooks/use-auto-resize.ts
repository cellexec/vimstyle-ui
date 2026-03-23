/**
 * Auto-resizes a textarea to fit its content, up to a maximum height.
 * Beyond the max height, the textarea becomes scrollable.
 *
 * Call the returned `resize` function on every input event, or pass
 * the ref and it auto-resizes on value changes.
 */
"use client";

import { useCallback, useEffect } from "react";

export function useAutoResize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxHeight = 176
) {
  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const h = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${h}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return resize;
}
