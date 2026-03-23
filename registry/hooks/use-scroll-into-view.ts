/**
 * Scrolls the currently selected item into the visible area of its
 * scroll container.
 *
 * Targets elements with a `data-item-index` attribute matching
 * `selectedIndex` inside the provided `listRef` container.
 */
"use client";

import { useEffect } from "react";

export function useScrollIntoView(
  listRef: React.RefObject<HTMLElement | null>,
  selectedIndex: number
) {
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const el = container.querySelector(
      `[data-item-index="${selectedIndex}"]`
    ) as HTMLElement | null;

    if (!el) return;

    // Manually scroll only the list container — avoids scrollIntoView
    // pushing parent containers (which hides the search bar above).
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    if (elRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - elRect.top;
    } else if (elRect.bottom > containerRect.bottom) {
      container.scrollTop += elRect.bottom - containerRect.bottom;
    }
  }, [listRef, selectedIndex]);
}
