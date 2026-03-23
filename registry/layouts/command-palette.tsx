/**
 * Floating command palette overlay with fuzzy search and keyboard
 * navigation. Opens centered on screen, filters as you type.
 *
 * Composes: SearchBar, ListItem, FuzzyText, KbdHint,
 * useFuzzyFilter, useScrollIntoView.
 */
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { ListItem } from "@/components/list-item";
import { FuzzyText } from "@/components/fuzzy-text";
import { KbdHint } from "@/components/kbd-hint";
import { useFuzzyFilter } from "@/hooks/use-fuzzy-filter";
import { useScrollIntoView } from "@/hooks/use-scroll-into-view";

interface CommandPaletteProps<T> {
  open: boolean;
  onClose: () => void;
  items: T[];
  keyFn: (item: T) => string;
  renderItem?: (
    item: T,
    props: { selected: boolean; query: string }
  ) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
}

export function CommandPalette<T>({
  open,
  onClose,
  items,
  keyFn,
  renderItem,
  onSelect,
  placeholder = "Type a command…",
}: CommandPaletteProps<T>) {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const listRef = useRef<HTMLDivElement>(null!);

  const filtered = useFuzzyFilter(items, query, keyFn, setSelectedIndex);
  useScrollIntoView(listRef, selectedIndex);

  // Focus search on open, reset state on close
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setSearchFocused(true);
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const handleSelect = useCallback(
    (index: number) => {
      if (filtered[index]) {
        onSelect(filtered[index]);
        onClose();
      }
    },
    [filtered, onSelect, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowDown" || (e.key === "j" && e.ctrlKey)) {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "k" && e.ctrlKey)) {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, filtered.length, selectedIndex, handleSelect, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-overlay-open
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed inset-x-0 top-[15%] z-50 mx-auto w-full max-w-lg px-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            searchRef={searchRef}
            searchFocused={searchFocused}
            onFocusChange={setSearchFocused}
            placeholder={placeholder}
          />

          <div
            ref={listRef}
            className="max-h-[300px] overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-zinc-600">
                No results found
              </div>
            ) : (
              filtered.map((item, i) => (
                <ListItem
                  key={keyFn(item)}
                  index={i}
                  selected={i === selectedIndex}
                  onClick={() => handleSelect(i)}
                  onMouseMove={() => setSelectedIndex(i)}
                >
                  {renderItem ? (
                    renderItem(item, {
                      selected: i === selectedIndex,
                      query,
                    })
                  ) : (
                    <FuzzyText
                      text={keyFn(item)}
                      query={query}
                      className="text-sm text-zinc-200"
                    />
                  )}
                </ListItem>
              ))
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2 text-[11px] text-zinc-600">
            <div className="flex items-center gap-1.5">
              <KbdHint size="sm">↑</KbdHint>
              <KbdHint size="sm">↓</KbdHint>
              <span>navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <KbdHint size="sm">Enter</KbdHint>
              <span>select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <KbdHint size="sm">Esc</KbdHint>
              <span>close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
