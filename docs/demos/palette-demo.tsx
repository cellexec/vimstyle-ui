/**
 * Command palette demo showcasing the CommandPalette layout.
 * Press the button or Ctrl+K to open, then search and select actions.
 */
"use client";

import React, { useState, useEffect } from "react";
import { CommandPalette } from "@/layouts/command-palette";
import { KbdHint } from "@/components/kbd-hint";
import { ResponsivePreview } from "./responsive-preview";

interface Command {
  id: string;
  name: string;
  category: string;
}

const commands: Command[] = [
  { id: "1", name: "New Project", category: "Projects" },
  { id: "2", name: "Open Settings", category: "Navigation" },
  { id: "3", name: "Toggle Dark Mode", category: "Appearance" },
  { id: "4", name: "Search Files", category: "Navigation" },
  { id: "5", name: "Git: Commit Changes", category: "Git" },
  { id: "6", name: "Git: Push to Remote", category: "Git" },
  { id: "7", name: "Git: Create Branch", category: "Git" },
  { id: "8", name: "Run Tests", category: "Development" },
  { id: "9", name: "Start Dev Server", category: "Development" },
  { id: "10", name: "Deploy to Production", category: "Development" },
  { id: "11", name: "Invite Team Member", category: "Team" },
  { id: "12", name: "View Keyboard Shortcuts", category: "Help" },
];

export function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  // Ctrl+K to open (scoped to the demo)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ResponsivePreview height={550}>
      <div className="flex h-full flex-col items-center justify-center gap-6 bg-zinc-950 p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-100">
            Command Palette
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Quick access to every action in your app
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
        >
          <svg
            className="h-4 w-4 text-zinc-500"
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
          Search commands…
          <div className="flex items-center gap-1">
            <KbdHint size="sm">⌘</KbdHint>
            <KbdHint size="sm">K</KbdHint>
          </div>
        </button>

        {lastCommand && (
          <p className="text-sm text-zinc-400">
            Ran:{" "}
            <span className="font-medium text-violet-400">{lastCommand}</span>
          </p>
        )}
      </div>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={commands}
        keyFn={(c) => c.name}
        onSelect={(command) => setLastCommand(command.name)}
        placeholder="Type a command…"
        renderItem={(command, { query }) => (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-sm text-zinc-200">
                {query ? (
                  <span>
                    {command.name.split("").map((char, i) => {
                      const q = query.toLowerCase();
                      const name = command.name.toLowerCase();
                      let ti = 0;
                      const indices = new Set<number>();
                      for (let qi = 0; qi < q.length; qi++) {
                        const idx = name.indexOf(q[qi], ti);
                        if (idx !== -1) {
                          indices.add(idx);
                          ti = idx + 1;
                        }
                      }
                      return indices.has(i) ? (
                        <span
                          key={i}
                          className="font-semibold text-violet-300"
                        >
                          {char}
                        </span>
                      ) : (
                        <span key={i}>{char}</span>
                      );
                    })}
                  </span>
                ) : (
                  command.name
                )}
              </span>
            </div>
            <span className="shrink-0 text-[11px] text-zinc-600">
              {command.category}
            </span>
          </div>
        )}
      />
    </ResponsivePreview>
  );
}
