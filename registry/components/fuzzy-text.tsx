/**
 * Highlights characters in `text` that fuzzy-match the given `query`.
 *
 * Non-matching text is rendered plain; matched characters are wrapped in a
 * `<span>` with the `highlightClass` style (defaults to violet bold).
 */
"use client";

import React from "react";
import { fuzzyIndices } from "@/lib/fuzzy";

interface FuzzyTextProps {
  text: string;
  query: string;
  className?: string;
  /** Tailwind classes applied to each matched character. */
  highlightClass?: string;
}

export function FuzzyText({
  text,
  query,
  className,
  highlightClass = "text-violet-300 font-semibold",
}: FuzzyTextProps) {
  if (!query) {
    return <span className={className}>{text}</span>;
  }

  const indices = fuzzyIndices(text, query);

  if (!indices) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {Array.from(text).map((char, i) =>
        indices.has(i) ? (
          <span key={i} className={highlightClass}>
            {char}
          </span>
        ) : (
          <React.Fragment key={i}>{char}</React.Fragment>
        )
      )}
    </span>
  );
}
