"use client";

import React, { useRef, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ComponentPreview } from "./component-preview";

export function SearchBarDemo() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null!);

  return (
    <ComponentPreview>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        searchRef={ref}
        searchFocused={focused}
        onFocusChange={setFocused}
        placeholder="Type to search..."
      />
      {query && (
        <div className="px-6 py-3 text-sm text-zinc-400">
          Searching for: <span className="text-violet-400">{query}</span>
        </div>
      )}
    </ComponentPreview>
  );
}
