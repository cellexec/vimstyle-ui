"use client";

import React, { useRef, useState } from "react";
import { VimList } from "@/components/vim-list";
import { ListItem } from "@/components/list-item";
import { SectionHeader } from "@/components/section-header";
import { FuzzyText } from "@/components/fuzzy-text";
import { useFuzzyFilter } from "@/hooks/use-fuzzy-filter";
import { ComponentPreview } from "./component-preview";

const items = [
  { id: "1", name: "Dashboard", section: "Pages" },
  { id: "2", name: "Settings", section: "Pages" },
  { id: "3", name: "User Profile", section: "Pages" },
  { id: "4", name: "useVimNavigation", section: "Hooks" },
  { id: "5", name: "useFuzzyFilter", section: "Hooks" },
  { id: "6", name: "KbdButton", section: "Components" },
  { id: "7", name: "VimList", section: "Components" },
];

export function VimListDemo() {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const listRef = useRef<HTMLDivElement>(null!);

  const filtered = useFuzzyFilter(
    items,
    query,
    (item) => item.name,
    setSelectedIndex
  );

  const sections = filtered.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  let flatIndex = 0;

  return (
    <ComponentPreview className="h-[350px] flex flex-col">
      <VimList
        query={query}
        onQueryChange={setQuery}
        searchRef={searchRef}
        searchFocused={searchFocused}
        onFocusChange={setSearchFocused}
        listRef={listRef}
        placeholder="Filter items..."
      >
        {Object.entries(sections).map(([section, sectionItems]) => (
          <React.Fragment key={section}>
            <SectionHeader>{section}</SectionHeader>
            {sectionItems.map((item) => {
              const idx = flatIndex++;
              return (
                <ListItem
                  key={item.id}
                  index={idx}
                  selected={idx === selectedIndex}
                  onClick={() => setSelectedIndex(idx)}
                  onMouseMove={() => setSelectedIndex(idx)}
                >
                  <FuzzyText
                    text={item.name}
                    query={query}
                    className="text-sm text-zinc-200"
                  />
                </ListItem>
              );
            })}
          </React.Fragment>
        ))}
      </VimList>
    </ComponentPreview>
  );
}
