/**
 * Distinguishes single-click from double-click on the same element.
 *
 * Single click fires after a 200ms delay (to wait for a potential
 * second click). Double click fires immediately and cancels the
 * pending single click.
 */
"use client";

import { useRef, useCallback } from "react";

interface UseDoubleClickOptions {
  /** Called on single click (after delay). */
  onSingleClick: () => void;
  /** Called on double click (immediately). */
  onDoubleClick: () => void;
  /** Delay before single click fires (ms). Default 200. */
  delay?: number;
}

export function useDoubleClick({
  onSingleClick,
  onDoubleClick,
  delay = 200,
}: UseDoubleClickOptions) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = useCallback(() => {
    if (timer.current) {
      // Second click within delay — double click
      clearTimeout(timer.current);
      timer.current = undefined;
      onDoubleClick();
    } else {
      // First click — wait for potential second
      timer.current = setTimeout(() => {
        timer.current = undefined;
        onSingleClick();
      }, delay);
    }
  }, [onSingleClick, onDoubleClick, delay]);

  return handleClick;
}
