"use client";

import React from "react";
import { useYankMode } from "@/hooks/use-yank-mode";
import { Yankable } from "@/components/yankable";
import { YankIndicator } from "@/components/yank-indicator";
import { Showcase } from "./showcase";

const items = [
  { id: "1", name: "API Gateway", value: "https://github.com/org/api-gateway" },
  { id: "2", name: "Dashboard", value: "https://github.com/org/dashboard" },
  { id: "3", name: "Mobile App", value: "https://github.com/org/mobile-app" },
  { id: "4", name: "Auth Service", value: "https://github.com/org/auth" },
  { id: "5", name: "Design System", value: "https://github.com/org/design" },
];

export function YankDemo() {
  const { active, typed, hints, matching, lastYanked } = useYankMode({
    targets: items.map((i) => ({ key: i.id, label: i.name, value: i.value })),
  });

  return (
    <Showcase
      hints={[
        { keys: "y", label: "enter yank mode" },
        { keys: "Esc", label: "cancel" },
      ]}
    >
      <div className="p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Press y then type a prefix to copy
        </p>
        <div className="space-y-1">
          {items.map((item) => {
            const isMatching = matching.has(item.id);
            const hint = hints.get(item.id) ?? "";

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-150 ${
                  active && isMatching
                    ? "bg-amber-500/[0.06] border border-amber-500/20"
                    : active && !isMatching
                      ? "opacity-25 border border-transparent"
                      : "border border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {active && isMatching && (
                    <span className="font-mono text-[10px] font-bold text-amber-400">
                      {hint.split("").map((char, i) => (
                        <span
                          key={i}
                          className={i < typed.length ? "text-amber-500/40" : ""}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  )}
                  <Yankable active={active} matching={isMatching}>
                    <span className="text-sm text-zinc-200">{item.name}</span>
                  </Yankable>
                </div>
                <span className="text-[11px] text-zinc-600 truncate max-w-[180px]">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <YankIndicator active={active} typed={typed} lastYanked={lastYanked} />
    </Showcase>
  );
}
