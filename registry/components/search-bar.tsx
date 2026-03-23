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
    <div
      className={`relative flex items-center border-b bg-zinc-950/80 transition-colors duration-150 ${
        searchFocused
          ? "border-violet-500/40 bg-violet-500/[0.03]"
          : "border-white/[0.06]"
      }`}
    >
      {/* Magnifying glass icon */}
      <svg
        className={`absolute left-4 h-4 w-4 pointer-events-none transition-colors duration-150 ${
          searchFocused ? "text-violet-400" : "text-zinc-500"
        }`}
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

      {/* Show "Esc" hint when focused, "/" hint when idle */}
      <div className="absolute right-4 pointer-events-none">
        {searchFocused ? (
          <KbdHint size="sm">Esc</KbdHint>
        ) : !query ? (
          <KbdHint>/</KbdHint>
        ) : null}
      </div>
    </div>
  );
}
