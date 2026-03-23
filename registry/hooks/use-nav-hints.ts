/**
 * Keyboard-driven hint navigation — press a key to activate, then type
 * the shortest unique prefix of a label to jump to it instantly.
 *
 * Inspired by vimium's link hints: each item gets the shortest unique
 * prefix of its label. Type that prefix and the item is selected
 * immediately — no Enter required.
 *
 * Works with any list of labelled targets (sidebar links, tabs, actions).
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export interface NavHintItem {
  /** Unique identifier for this item. */
  key: string;
  /** Display label — the prefix is computed from this. */
  label: string;
}

/** Compute the shortest unique lowercase prefix for each item's label. */
export function computeHints(items: NavHintItem[]): Map<string, string> {
  const hints = new Map<string, string>();

  for (const item of items) {
    const lower = item.label.toLowerCase();
    let len = 1;

    while (len <= lower.length) {
      const prefix = lower.slice(0, len);
      const conflicts = items.filter(
        (other) =>
          other.key !== item.key &&
          other.label.toLowerCase().startsWith(prefix)
      );
      if (conflicts.length === 0) break;
      len++;
    }

    hints.set(item.key, lower.slice(0, len));
  }

  return hints;
}

export interface UseNavHintsOptions {
  /** Items that can be targeted. */
  items: NavHintItem[];
  /** Called when the typed prefix uniquely matches an item. */
  onMatch?: (item: NavHintItem) => void;
  /** Auto-cancel after this many ms of inactivity. Default 3000. */
  timeout?: number;
  /** Key that toggles hint mode. Default `" "` (Space). */
  activationKey?: string;
}

export function useNavHints({
  items,
  onMatch,
  timeout = 3000,
  activationKey = " ",
}: UseNavHintsOptions) {
  const [active, setActive] = useState(false);
  const [typed, setTyped] = useState("");

  const hints = useMemo(() => computeHints(items), [items]);

  const matching = useMemo(() => {
    if (!active || !typed) return new Set(items.map((i) => i.key));
    const set = new Set<string>();
    for (const item of items) {
      const hint = hints.get(item.key) ?? "";
      if (hint.startsWith(typed)) set.add(item.key);
    }
    return set;
  }, [active, typed, items, hints]);

  const deactivate = useCallback(() => {
    setActive(false);
    setTyped("");
  }, []);

  // Fire callback when typed prefix uniquely matches
  useEffect(() => {
    if (!active || !typed) return;

    for (const item of items) {
      const hint = hints.get(item.key);
      if (hint === typed) {
        onMatch?.(item);
        deactivate();
        return;
      }
    }

    if (matching.size === 0) deactivate();
  }, [active, typed, items, hints, matching, onMatch, deactivate]);

  // Global keydown listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const isEditable = (e.target as HTMLElement)?.isContentEditable;

      if (!active) {
        if (isInput || isEditable) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (document.querySelector("[data-overlay-open]")) return;
        if (e.key === activationKey) {
          e.preventDefault();
          setActive(true);
          setTyped("");
        }
        return;
      }

      // Hint mode active — consume all keys
      if (e.key === "Escape" || e.key === activationKey) {
        e.preventDefault();
        deactivate();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setTyped((t) => {
          const next = t.slice(0, -1);
          if (!next) deactivate();
          return next;
        });
        return;
      }

      if (
        e.key.length === 1 &&
        /[a-z]/i.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setTyped((t) => t + e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [active, activationKey, deactivate]);

  // Auto-cancel after timeout
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(deactivate, timeout);
    return () => clearTimeout(timer);
  }, [active, typed, timeout, deactivate]);

  return { active, typed, hints, matching, deactivate };
}
