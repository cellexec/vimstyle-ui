/**
 * Core keyboard handler hook implementing a six-layer input system.
 *
 * Layer priority (highest first):
 * 1. **Save/Discard dialog** — intercepts Enter / q / Esc
 * 2. **Confirm dialog** — intercepts Enter / Esc
 * 3. **Overlay** — Esc closes it, everything else ignored
 * 4. **Editing mode** — Esc exits (prompting save if changes exist)
 * 5. **Search focused** — Esc blurs & clears, all other keys go to input
 * 6. **Normal navigation** — j/k move, Enter selects, / focuses search,
 *    Esc calls `onEscape`, plus any extra `shortcuts`
 *
 * Registers on `window` in the **capture** phase so it runs before React
 * synthetic event handlers.
 */
"use client";

import { useEffect } from "react";

interface UseVimNavigationOptions {
  items: unknown[];
  selectedIndex: number;
  setSelectedIndex: (fn: (i: number) => number) => void;
  searchFocused: boolean;
  setSearchFocused: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  onSelect?: (index: number) => void;
  onEscape?: () => void;

  // Layer: editing
  editingId?: string | null;
  hasChanges?: boolean;
  onSave?: () => void;
  onExitEdit?: () => void;

  // Layer: save/discard dialog
  showSaveDiscard?: boolean;
  setShowSaveDiscard?: (v: boolean) => void;
  onDiscard?: () => void;

  // Layer: confirm dialog
  confirmDialog?: boolean;
  setConfirmDialog?: (v: boolean) => void;
  onConfirm?: () => void;

  // Layer: overlay
  overlayOpen?: boolean;
  setOverlayOpen?: (v: boolean) => void;

  // Extra shortcuts for normal mode
  shortcuts?: Record<string, () => void>;
}

export function useVimNavigation({
  items,
  selectedIndex,
  setSelectedIndex,
  searchFocused,
  setSearchFocused,
  query,
  setQuery,
  searchRef,
  onSelect,
  onEscape,
  editingId,
  hasChanges,
  onSave,
  onExitEdit,
  showSaveDiscard,
  setShowSaveDiscard,
  onDiscard,
  confirmDialog,
  setConfirmDialog,
  onConfirm,
  overlayOpen,
  setOverlayOpen,
  shortcuts,
}: UseVimNavigationOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ── Layer 1: Save/Discard dialog ──────────────────────────────
      if (showSaveDiscard) {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onSave?.();
          setShowSaveDiscard?.(false);
        } else if (e.key === "q" || e.key === "Q") {
          e.preventDefault();
          e.stopPropagation();
          onDiscard?.();
          setShowSaveDiscard?.(false);
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setShowSaveDiscard?.(false);
        }
        return;
      }

      // ── Layer 2: Confirm dialog ───────────────────────────────────
      if (confirmDialog) {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onConfirm?.();
          setConfirmDialog?.(false);
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setConfirmDialog?.(false);
        }
        return;
      }

      // ── Layer 3: Overlay ──────────────────────────────────────────
      if (overlayOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setOverlayOpen?.(false);
        }
        return;
      }

      // ── Layer 4: Editing mode ─────────────────────────────────────
      if (editingId) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (hasChanges) {
            setShowSaveDiscard?.(true);
          } else {
            onExitEdit?.();
          }
        }
        return;
      }

      // ── Layer 5: Search focused ───────────────────────────────────
      if (searchFocused) {
        if (e.key === "Escape") {
          e.preventDefault();
          searchRef.current?.blur();
          setSearchFocused(false);
          if (query) setQuery("");
        }
        // All other keys go to the input naturally
        return;
      }

      // ── Layer 6: Normal navigation ────────────────────────────────
      const key = e.key;

      // j / ArrowDown — move selection down
      if (key === "j" || key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i: number) => Math.min(i + 1, items.length - 1));
        return;
      }

      // k / ArrowUp — move selection up
      if (key === "k" || key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i: number) => Math.max(i - 1, 0));
        return;
      }

      // Enter — select current item
      if (key === "Enter") {
        e.preventDefault();
        onSelect?.(selectedIndex);
        return;
      }

      // / — focus search
      if (key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchFocused(true);
        return;
      }

      // Escape — call onEscape handler
      if (key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }

      // Extra shortcuts
      if (shortcuts && key in shortcuts) {
        e.preventDefault();
        shortcuts[key]();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    items,
    selectedIndex,
    setSelectedIndex,
    searchFocused,
    setSearchFocused,
    query,
    setQuery,
    searchRef,
    onSelect,
    onEscape,
    editingId,
    hasChanges,
    onSave,
    onExitEdit,
    showSaveDiscard,
    setShowSaveDiscard,
    onDiscard,
    confirmDialog,
    setConfirmDialog,
    onConfirm,
    overlayOpen,
    setOverlayOpen,
    shortcuts,
  ]);
}
