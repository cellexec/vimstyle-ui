/**
 * Prevents accidental hover-selection on page load.
 *
 * On initial mount `mouseActive` is `false`. It flips to `true` on the
 * first real `mousemove` event (detected via non-zero `movementX/Y`).
 *
 * `onItemMouseMove` is a convenience callback to attach to list items —
 * it only updates `selectedIndex` when the mouse is genuinely active.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseMouseInteractionReturn {
  mouseActive: boolean;
  onItemMouseMove: (
    index: number,
    setSelectedIndex: (fn: (i: number) => number) => void
  ) => void;
}

export function useMouseInteraction(): UseMouseInteractionReturn {
  const [mouseActive, setMouseActive] = useState(false);
  const mouseActiveRef = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!mouseActiveRef.current && (e.movementX !== 0 || e.movementY !== 0)) {
        mouseActiveRef.current = true;
        setMouseActive(true);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onItemMouseMove = useCallback(
    (
      index: number,
      setSelectedIndex: (fn: (i: number) => number) => void
    ) => {
      if (mouseActiveRef.current) {
        setSelectedIndex(() => index);
      }
    },
    []
  );

  return { mouseActive, onItemMouseMove };
}
