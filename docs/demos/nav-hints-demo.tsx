"use client";

import React, { useEffect, useRef } from "react";
import { useNavHints } from "@/hooks/use-nav-hints";
import { HintLabel } from "@/components/hint-label";
import { NavIndicator } from "@/components/nav-indicator";
import { Showcase } from "./showcase";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" },
  { key: "projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
  { key: "settings", label: "Settings", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" },
  { key: "specs", label: "Specifications", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  { key: "knowledge", label: "Knowledge", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
];

export function NavHintsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active, typed, hints, matching } = useNavHints({
    items: navItems,
    onMatch: () => {},
  });

  // Mark this page so the global SpaceMotion disables itself
  useEffect(() => {
    const marker = document.createElement("div");
    marker.setAttribute("data-space-motion-disabled", "");
    marker.style.display = "none";
    document.body.appendChild(marker);
    return () => marker.remove();
  }, []);

  return (
    <div ref={containerRef}>
    <Showcase
      hints={[
        { keys: "Space", label: "enter hint mode" },
        { keys: "Esc", label: "cancel" },
      ]}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[200px] border-r border-white/[0.06] p-3">
          <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Navigation
          </p>
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const hint = hints.get(item.key) ?? "";
              const dimmed = active && !matching.has(item.key);

              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 ${
                    dimmed
                      ? "opacity-25"
                      : "text-zinc-300 hover:bg-white/[0.04]"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                      active && matching.has(item.key)
                        ? "text-violet-400"
                        : "text-zinc-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                  <HintLabel
                    label={item.label}
                    hint={hint}
                    typed={typed}
                    active={active}
                    dimmed={dimmed}
                  />
                </div>
              );
            })}
          </div>

          {active && (
            <div className="mt-3 rounded-md border border-violet-500/20 bg-violet-500/[0.04] px-2 py-1.5">
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
        </div>

        {/* Content area */}
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-zinc-500">
            Press <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">Space</kbd> to activate hint navigation
          </p>
        </div>
      </div>
      <NavIndicator active={active} typed={typed} />
    </Showcase>
    </div>
  );
}
