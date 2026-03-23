/**
 * Keyboard-driven sidebar with j/k navigation, space-motion hints,
 * collapsible sections, drag-to-resize, and collapse toggle.
 *
 * Composes: useNavHints, HintLabel, NavIndicator.
 */
"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavHints } from "@/hooks/use-nav-hints";
import type { NavHintItem } from "@/hooks/use-nav-hints";
import { HintLabel } from "@/components/hint-label";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
  /** Whether this section starts collapsed. Default false. */
  defaultCollapsed?: boolean;
}

interface VimSidebarProps {
  /** Sidebar title shown in the header. */
  title?: string;
  /** Logo or icon shown before the title. */
  logo?: React.ReactNode;
  /** Grouped navigation sections. */
  sections: SidebarSection[];
  /** Footer content below the nav. */
  footer?: React.ReactNode;
  /** Called when space-motion matches an item. Default: router.push. */
  onNavigate?: (href: string) => void;
}

// ── Sidebar state ────────────────────────────────────────────────────────────

const COLLAPSED_KEY = "vim-sidebar-collapsed";
const WIDTH_KEY = "vim-sidebar-width";
const DEFAULT_WIDTH = 260;
const COLLAPSED_WIDTH = 56;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

function useSidebarResize() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true");
    const w = localStorage.getItem(WIDTH_KEY);
    if (w) {
      const n = parseInt(w, 10);
      if (Number.isFinite(n))
        setExpandedWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, n)));
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((p) => {
      localStorage.setItem(COLLAPSED_KEY, String(!p));
      return !p;
    });
  }, []);

  const onDragMove = useCallback((e: MouseEvent) => {
    const w = Math.max(
      MIN_WIDTH,
      Math.min(MAX_WIDTH, dragStartWidth.current + e.clientX - dragStartX.current)
    );
    setExpandedWidth(w);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    setExpandedWidth((w) => {
      localStorage.setItem(WIDTH_KEY, String(w));
      return w;
    });
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent) => onDragMove(e);
    const up = () => onDragEnd();
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, onDragMove, onDragEnd]);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragStartX.current = e.clientX;
      dragStartWidth.current = expandedWidth;
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [expandedWidth]
  );

  return {
    collapsed,
    toggle,
    width: collapsed ? COLLAPSED_WIDTH : expandedWidth,
    isDragging,
    onDragStart,
    hydrated,
  };
}

// ── Tooltip (collapsed mode) ─────────────────────────────────────────────────

function NavTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (ref.current) {
          const r = ref.current.getBoundingClientRect();
          setPos({ top: r.top + r.height / 2, left: r.right + 8 });
        }
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}
      className="relative"
    >
      {children}
      {show && (
        <div
          className="pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 shadow-lg"
          style={{ top: pos.top, left: pos.left }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function VimSidebar({
  title = "Navigation",
  logo,
  sections,
  footer,
  onNavigate,
}: VimSidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle, width, isDragging, onDragStart, hydrated } =
    useSidebarResize();

  // Track collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () =>
      new Set(
        sections
          .filter((s) => s.defaultCollapsed)
          .map((s) => s.title)
      )
  );

  const toggleSection = (title: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  // j/k navigation
  const allItems = useMemo(
    () =>
      sections.flatMap((s) =>
        collapsedSections.has(s.title) ? [] : s.items
      ),
    [sections, collapsedSections]
  );
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Space-motion hints
  const hintItems: NavHintItem[] = useMemo(
    () => allItems.map((item) => ({ key: item.key, label: item.label })),
    [allItems]
  );

  const handleMatch = useCallback(
    (item: NavHintItem) => {
      const target = allItems.find((i) => i.key === item.key);
      if (target) {
        if (onNavigate) onNavigate(target.href);
        else window.location.href = target.href;
      }
    },
    [allItems, onNavigate]
  );

  const {
    active: hintActive,
    typed,
    hints,
    matching,
  } = useNavHints({ items: hintItems, onMatch: handleMatch });

  // j/k keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (hintActive) return;

      const count = allItems.length;
      if (count === 0) return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((p) => Math.min(p + 1, count - 1));
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((p) => Math.max(p - 1, 0));
          break;
        case "Enter":
          if (selectedIndex >= 0 && allItems[selectedIndex]) {
            e.preventDefault();
            const href = allItems[selectedIndex].href;
            if (onNavigate) onNavigate(href);
            else window.location.href = href;
          }
          break;
        case "Escape":
          if (selectedIndex >= 0) {
            e.preventDefault();
            setSelectedIndex(-1);
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, allItems, hintActive, onNavigate]);

  // Reset selection on pathname change
  useEffect(() => setSelectedIndex(-1), [pathname]);

  // Scroll selected into view
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selectedIndex < 0 || !navRef.current) return;
    const el = navRef.current.querySelector(
      `[data-sidebar-index="${selectedIndex}"]`
    );
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  let flatIndex = 0;

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-white/[0.06] bg-zinc-950 overflow-hidden ${
        isDragging ? "" : "transition-[width] duration-200 ease-in-out"
      }`}
      style={{ width, visibility: hydrated ? "visible" : "hidden" }}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-white/[0.06] ${
          collapsed ? "justify-center px-1.5 py-3" : "gap-2 px-4 py-3"
        }`}
      >
        {logo && (
          <div className="shrink-0 flex items-center justify-center">
            {logo}
          </div>
        )}
        {!collapsed && (
          <span className="truncate text-sm font-medium text-zinc-200">
            {title}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className={`flex flex-1 flex-col overflow-y-auto ${
          collapsed ? "px-1.5" : "px-3"
        } py-2`}
      >
        {sections.map((section) => {
          const isCollapsedSection = collapsedSections.has(section.title);

          return (
            <div key={section.title} className="mb-1">
              {/* Section header */}
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center gap-1 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-zinc-400"
                >
                  <svg
                    className={`h-3 w-3 shrink-0 transition-transform ${
                      isCollapsedSection ? "-rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {section.title}
                </button>
              )}

              {/* Items */}
              {!isCollapsedSection && (
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const idx = flatIndex++;
                    const isActive = pathname === item.href;
                    const isSelected = idx === selectedIndex;
                    const hint = hints.get(item.key) ?? "";
                    const dimmed =
                      hintActive && !matching.has(item.key);

                    const link = (
                      <Link
                        href={item.href}
                        data-sidebar-index={idx}
                        className={`flex items-center rounded-lg text-sm transition-colors outline-none ${
                          collapsed
                            ? "justify-center px-2 py-2"
                            : "gap-2.5 px-2.5 py-1.5 min-w-0"
                        } ${
                          isActive
                            ? "bg-violet-500/10 text-violet-300"
                            : isSelected
                              ? "bg-white/[0.06] text-zinc-100"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                        } ${dimmed ? "opacity-25" : ""}`}
                      >
                        {item.icon && (
                          <span
                            className={`shrink-0 ${
                              isActive
                                ? "text-violet-400"
                                : "text-zinc-500"
                            }`}
                          >
                            {item.icon}
                          </span>
                        )}
                        {!collapsed && (
                          <HintLabel
                            label={item.label}
                            hint={hint}
                            typed={typed}
                            active={hintActive}
                            dimmed={dimmed}
                          />
                        )}
                      </Link>
                    );

                    return collapsed ? (
                      <NavTooltip key={item.key} label={item.label}>
                        {link}
                      </NavTooltip>
                    ) : (
                      <div key={item.key}>{link}</div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Hint mode indicator */}
      {hintActive && !collapsed && (
        <div className="border-t border-violet-500/20 bg-violet-500/[0.04] px-3 py-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-medium text-violet-400">NAV</span>
            {typed ? (
              <span className="font-mono text-violet-300">
                {typed}
                <span className="animate-pulse">_</span>
              </span>
            ) : (
              <span className="text-zinc-500">type to jump...</span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className={`border-t border-white/[0.06] ${
          collapsed ? "px-1.5" : "px-3"
        } py-2 flex flex-col gap-0.5`}
      >
        {footer}
        <button
          onClick={toggle}
          className={`flex w-full items-center rounded-lg px-2.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            )}
          </svg>
          {!collapsed && <span className="truncate">Collapse</span>}
        </button>
      </div>

      {/* Drag handle */}
      {!collapsed && (
        <div
          role="separator"
          aria-label="Resize sidebar"
          onMouseDown={onDragStart}
          className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize transition-colors hover:bg-violet-500/20"
        />
      )}
    </aside>
  );
}
