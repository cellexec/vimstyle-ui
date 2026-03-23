"use client";

import React, { useState } from "react";
import { FuzzyText } from "@/components/fuzzy-text";
import { ComponentPreview } from "./component-preview";

const examples = [
  "ProjectAlpha",
  "SettingsPage",
  "useVimNavigation",
  "FuzzyTextComponent",
];

export function FuzzyTextDemo() {
  const [query, setQuery] = useState("pra");

  return (
    <ComponentPreview>
      <div className="p-6 space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a fuzzy query..."
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/40"
        />
        <div className="space-y-2">
          {examples.map((text) => (
            <div key={text} className="flex items-center gap-3">
              <FuzzyText
                text={text}
                query={query}
                className="text-sm text-zinc-300"
              />
            </div>
          ))}
        </div>
      </div>
    </ComponentPreview>
  );
}
