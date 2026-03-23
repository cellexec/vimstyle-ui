/**
 * Fuzzy search input with a magnifying-glass icon and a `/` keyboard hint
 * that appears when the input is not focused and the query is empty.
 */
"use client";

import React from "react";
import { KbdHint } from "@/components/kbd-hint";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
  searchRef: React.RefObject<HTMLInputElement>;
  searchFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  placeholder = "Search\u2026",
  searchRef,
  searchFocused,
  onFocusChange,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center border-b border-white/[0.06] bg-zinc-950/80">
      {/* Magnifying glass icon */}
      <svg
        className="absolute left-4 h-4 w-4 text-zinc-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <input
        ref={searchRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        placeholder={placeholder}
        className="w-full bg-transparent py-3 pl-11 pr-12 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
      />

      {/* Show "/" hint when not focused and query is empty */}
      {!searchFocused && !query && (
        <div className="absolute right-4 pointer-events-none">
          <KbdHint>/</KbdHint>
        </div>
      )}
    </div>
  );
}
