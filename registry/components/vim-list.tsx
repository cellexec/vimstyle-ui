/**
 * Compound list component that combines a SearchBar with a scrollable
 * item area inside a rounded glass panel.
 *
 * Accepts list items as `children` — typically `<ListItem>` or
 * `<SectionHeader>` components.
 */
"use client";

import React from "react";
import { SearchBar } from "@/components/search-bar";

interface VimListProps {
  children: React.ReactNode;
  query: string;
  onQueryChange: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  searchFocused: boolean;
  onFocusChange: (focused: boolean) => void;
  listRef: React.RefObject<HTMLDivElement>;
  placeholder?: string;
}

export function VimList({
  children,
  query,
  onQueryChange,
  searchRef,
  searchFocused,
  onFocusChange,
  listRef,
  placeholder,
}: VimListProps) {
  return (
    <div className="rounded-xl border-2 border-white/[0.08] bg-zinc-950/60 overflow-hidden flex flex-col min-h-0">
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-zinc-950">
          <SearchBar
            query={query}
            onQueryChange={onQueryChange}
            searchRef={searchRef}
            searchFocused={searchFocused}
            onFocusChange={onFocusChange}
            placeholder={placeholder}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
