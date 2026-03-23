/**
 * Two-panel layout with a navigable list on the left and a detail pane
 * on the right. Selection in the list drives what the detail pane shows.
 *
 * Composes: VimPage, VimList, ListItem, SectionHeader, FuzzyText,
 * useVimNavigation, useFuzzyFilter, useMouseInteraction, useScrollIntoView.
 */
"use client";

import React, { useRef, useState, useCallback } from "react";
import { VimPage } from "@/components/vim-page";
import { VimList } from "@/components/vim-list";
import { ListItem } from "@/components/list-item";
import { SectionHeader } from "@/components/section-header";
import { FuzzyText } from "@/components/fuzzy-text";
import { useFuzzyFilter } from "@/hooks/use-fuzzy-filter";
import { useVimNavigation } from "@/hooks/use-vim-navigation";
import { useMouseInteraction } from "@/hooks/use-mouse-interaction";
import { useScrollIntoView } from "@/hooks/use-scroll-into-view";

interface HintDef {
  keys: string | string[];
  label: string;
}

interface SplitLayoutProps<T> {
  title: string;
  subtitle?: string;
  items: T[];
  keyFn: (item: T) => string;
  renderItem?: (
    item: T,
    props: { selected: boolean; query: string }
  ) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyDetail?: React.ReactNode;
  groupFn?: (item: T) => string;
  onSelect?: (item: T, index: number) => void;
  onEscape?: () => void;
  hints?: HintDef[];
  placeholder?: string;
  shortcuts?: Record<string, () => void>;
  listWidth?: string;
}

export function SplitLayout<T>({
  title,
  subtitle,
  items,
  keyFn,
  renderItem,
  renderDetail,
  emptyDetail,
  groupFn,
  onSelect,
  onEscape,
  hints = [
    { keys: ["j", "k"], label: "navigate" },
    { keys: "/", label: "search" },
    { keys: "Enter", label: "select" },
    { keys: "Esc", label: "back" },
  ],
  placeholder = "Search…",
  shortcuts,
  listWidth = "w-2/5",
}: SplitLayoutProps<T>) {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const listRef = useRef<HTMLDivElement>(null!);

  const filtered = useFuzzyFilter(items, query, keyFn, setSelectedIndex);
  const { onItemMouseMove } = useMouseInteraction();
  useScrollIntoView(listRef, selectedIndex);

  const selectedItem = filtered[selectedIndex] ?? null;

  const handleSelect = useCallback(
    (index: number) => {
      if (onSelect && filtered[index]) {
        onSelect(filtered[index], index);
      }
    },
    [onSelect, filtered]
  );

  useVimNavigation({
    items: filtered,
    selectedIndex,
    setSelectedIndex,
    searchFocused,
    setSearchFocused,
    query,
    setQuery,
    searchRef,
    onSelect: handleSelect,
    onEscape,
    shortcuts,
  });

  const renderItems = () => {
    if (groupFn) {
      const groups: Record<string, { item: T; flatIndex: number }[]> = {};
      filtered.forEach((item, i) => {
        const group = groupFn(item);
        if (!groups[group]) groups[group] = [];
        groups[group].push({ item, flatIndex: i });
      });

      return Object.entries(groups).map(([group, entries]) => (
        <React.Fragment key={group}>
          <SectionHeader>{group}</SectionHeader>
          {entries.map(({ item, flatIndex }) => (
            <ListItem
              key={keyFn(item)}
              index={flatIndex}
              selected={flatIndex === selectedIndex}
              onClick={() => handleSelect(flatIndex)}
              onMouseMove={() => onItemMouseMove(flatIndex, setSelectedIndex)}
            >
              {renderItem ? (
                renderItem(item, {
                  selected: flatIndex === selectedIndex,
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
          ))}
        </React.Fragment>
      ));
    }

    return filtered.map((item, i) => (
      <ListItem
        key={keyFn(item)}
        index={i}
        selected={i === selectedIndex}
        onClick={() => handleSelect(i)}
        onMouseMove={() => onItemMouseMove(i, setSelectedIndex)}
      >
        {renderItem ? (
          renderItem(item, { selected: i === selectedIndex, query })
        ) : (
          <FuzzyText
            text={keyFn(item)}
            query={query}
            className="text-sm text-zinc-200"
          />
        )}
      </ListItem>
    ));
  };

  return (
    <VimPage title={title} subtitle={subtitle} hints={hints}>
      <div className="flex h-full gap-4">
        <div className={`${listWidth} min-w-[240px] shrink-0`}>
          <VimList
            query={query}
            onQueryChange={setQuery}
            searchRef={searchRef}
            searchFocused={searchFocused}
            onFocusChange={setSearchFocused}
            listRef={listRef}
            placeholder={placeholder}
          >
            {renderItems()}
          </VimList>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-white/[0.08] bg-zinc-950/60">
          {selectedItem ? (
            renderDetail(selectedItem)
          ) : (
            emptyDetail ?? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-zinc-600">
                  Select an item to view details
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </VimPage>
  );
}
