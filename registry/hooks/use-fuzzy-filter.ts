/**
 * Filters an array of items using fuzzy matching and resets the selected
 * index to 0 whenever the query changes.
 *
 * Returns the filtered array. The caller owns both `query` and
 * `selectedIndex` state — this hook is a pure convenience wrapper.
 */
"use client";

import { useMemo, useEffect } from "react";
import { fuzzyMatch } from "@/lib/fuzzy";

export function useFuzzyFilter<T>(
  items: T[],
  query: string,
  keyFn: (item: T) => string,
  setSelectedIndex: (fn: (i: number) => number) => void
): T[] {
  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(() => 0);
  }, [query, setSelectedIndex]);

  return useMemo(() => {
    if (!query) return items;
    return items.filter((item) => fuzzyMatch(keyFn(item), query));
  }, [items, query, keyFn]);
}
