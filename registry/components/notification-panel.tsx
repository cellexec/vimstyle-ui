/**
 * Full-featured notification panel with vim-style keyboard navigation,
 * fuzzy search, date grouping, and dismiss/read actions.
 *
 * Composes: VimList, ListItem, FuzzyText, SectionHeader,
 * useVimNavigation, useFuzzyFilter, useMouseInteraction, useScrollIntoView.
 */
"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { VimList } from "@/components/vim-list";
import { ListItem } from "@/components/list-item";
import { SectionHeader } from "@/components/section-header";
import { FuzzyText } from "@/components/fuzzy-text";
import { KbdHint } from "@/components/kbd-hint";
import { useFuzzyFilter } from "@/hooks/use-fuzzy-filter";
import { useVimNavigation } from "@/hooks/use-vim-navigation";
import { useMouseInteraction } from "@/hooks/use-mouse-interaction";
import { useScrollIntoView } from "@/hooks/use-scroll-into-view";

// ── Date utilities ───────────────────────────────────────────────────────────

function dayLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return "Older";
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body?: string;
  timestamp: Date;
  read?: boolean;
}

interface NotificationPanelProps {
  /** List of notifications. */
  notifications: Notification[];
  /** Called when a notification is selected (Enter). */
  onSelect?: (notification: Notification) => void;
  /** Called when a notification is marked read (r). */
  onMarkRead?: (notification: Notification) => void;
  /** Called when a notification is dismissed (d). */
  onDismiss?: (notification: Notification) => void;
  /** Called when Escape is pressed in normal mode. */
  onClose?: () => void;
  /** Panel title. Default "Notifications". */
  title?: string;
}

export function NotificationPanel({
  notifications,
  onSelect,
  onMarkRead,
  onDismiss,
  onClose,
  title = "Notifications",
}: NotificationPanelProps) {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const listRef = useRef<HTMLDivElement>(null!);

  const filtered = useFuzzyFilter(
    notifications,
    query,
    (n) => n.title,
    setSelectedIndex
  );
  const { onItemMouseMove } = useMouseInteraction();
  useScrollIntoView(listRef, selectedIndex);

  const handleSelect = useCallback(
    (index: number) => {
      if (onSelect && filtered[index]) onSelect(filtered[index]);
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
    onEscape: onClose,
    shortcuts: {
      r: () => {
        if (onMarkRead && filtered[selectedIndex])
          onMarkRead(filtered[selectedIndex]);
      },
      d: () => {
        if (onDismiss && filtered[selectedIndex])
          onDismiss(filtered[selectedIndex]);
      },
      g: () => setSelectedIndex(() => 0),
      G: () => setSelectedIndex(() => filtered.length - 1),
    },
  });

  // Group by date
  const groups = useMemo(() => {
    const map: Record<string, { item: Notification; flatIndex: number }[]> =
      {};
    filtered.forEach((n, i) => {
      const label = dayLabel(n.timestamp);
      if (!map[label]) map[label] = [];
      map[label].push({ item: n, flatIndex: i });
    });
    return Object.entries(map);
  }, [filtered]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <svg
            className="h-4 w-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          <span className="text-sm font-medium text-zinc-200">{title}</span>
          <span className="text-xs text-zinc-500">
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <KbdHint size="sm">r</KbdHint> read
          </span>
          <span className="flex items-center gap-1">
            <KbdHint size="sm">d</KbdHint> dismiss
          </span>
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1">
        <VimList
          query={query}
          onQueryChange={setQuery}
          searchRef={searchRef}
          searchFocused={searchFocused}
          onFocusChange={setSearchFocused}
          listRef={listRef}
          placeholder="Filter notifications..."
        >
          {groups.map(([label, entries]) => (
            <React.Fragment key={label}>
              <SectionHeader>{label}</SectionHeader>
              {entries.map(({ item, flatIndex }) => (
                <ListItem
                  key={item.id}
                  index={flatIndex}
                  selected={flatIndex === selectedIndex}
                  onClick={() => handleSelect(flatIndex)}
                  onMouseMove={() =>
                    onItemMouseMove(flatIndex, setSelectedIndex)
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {!item.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      )}
                      <FuzzyText
                        text={item.title}
                        query={query}
                        className={`text-sm truncate ${
                          item.read ? "text-zinc-500" : "text-zinc-200"
                        }`}
                      />
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-600">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  {item.body && (
                    <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                      {item.body}
                    </p>
                  )}
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </VimList>
      </div>
    </div>
  );
}
