/**
 * Vim-style yank (copy) mode — press `y` to activate, then type the
 * shortest unique prefix of a target label to copy its value to the
 * clipboard.
 *
 * The consumer defines what's yankable and what value each target
 * yields. The hook handles activation, hint computation, keyboard
 * input, clipboard write, and a brief confirmation state.
 */
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { computeHints } from "@/hooks/use-nav-hints";

export interface YankTarget {
  /** Unique identifier for this target. */
  key: string;
  /** Display label — the prefix hint is computed from this. */
  label: string;
  /** The value that gets copied to the clipboard. */
  value: string;
}

export interface UseYankModeOptions {
  /** Items that can be yanked. */
  targets: YankTarget[];
  /** Called after a value is copied to the clipboard. */
  onYank?: (target: YankTarget) => void;
  /** Auto-cancel after this many ms of inactivity. Default 3000. */
  timeout?: number;
  /** Key that toggles yank mode. Default `"y"`. */
  activationKey?: string;
  /** How long the "copied" confirmation shows (ms). Default 1500. */
  confirmDuration?: number;
}

export function useYankMode({
  targets,
  onYank,
  timeout = 3000,
  activationKey = "y",
  confirmDuration = 1500,
}: UseYankModeOptions) {
  const [active, setActive] = useState(false);
  const [typed, setTyped] = useState("");
  const [lastYanked, setLastYanked] = useState<YankTarget | null>(null);
  const confirmTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hints = useMemo(
    () => computeHints(targets),
    [targets]
  );

  const matching = useMemo(() => {
    if (!active || !typed) return new Set(targets.map((t) => t.key));
    const set = new Set<string>();
    for (const target of targets) {
      const hint = hints.get(target.key) ?? "";
      if (hint.startsWith(typed)) set.add(target.key);
    }
    return set;
  }, [active, typed, targets, hints]);

  const deactivate = useCallback(() => {
    setActive(false);
    setTyped("");
  }, []);

  // Copy to clipboard when typed prefix uniquely matches
  useEffect(() => {
    if (!active || !typed) return;

    for (const target of targets) {
      const hint = hints.get(target.key);
      if (hint === typed) {
        navigator.clipboard.writeText(target.value).then(() => {
          setLastYanked(target);
          onYank?.(target);

          // Clear confirmation after duration
          clearTimeout(confirmTimer.current);
          confirmTimer.current = setTimeout(() => {
            setLastYanked(null);
          }, confirmDuration);
        });
        deactivate();
        return;
      }
    }

    if (matching.size === 0) deactivate();
  }, [
    active,
    typed,
    targets,
    hints,
    matching,
    onYank,
    deactivate,
    confirmDuration,
  ]);

  // Global keydown listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;

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

      // Yank mode active — consume all keys
      if (e.key === "Escape") {
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

  // Cleanup confirm timer on unmount
  useEffect(() => {
    return () => clearTimeout(confirmTimer.current);
  }, []);

  return { active, typed, hints, matching, lastYanked, deactivate };
}
