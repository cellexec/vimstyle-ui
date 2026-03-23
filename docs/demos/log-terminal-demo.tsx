"use client";

import React, { useState, useEffect } from "react";
import { LogTerminal } from "@/components/log-terminal";
import type { LogLine } from "@/components/log-terminal";
import { Showcase } from "./showcase";

const sampleLines: LogLine[] = [
  { id: "1", text: "$ bun run build", variant: "dim", timestamp: "09:41" },
  { id: "2", text: "[MDX] generated files in 38ms", variant: "info", timestamp: "09:41" },
  { id: "3", text: "▲ Next.js 16.2.1 (Turbopack)", timestamp: "09:41" },
  { id: "4", text: "Creating optimized production build...", timestamp: "09:41" },
  { id: "5", text: "✓ Compiled successfully in 6.8s", variant: "info", timestamp: "09:42" },
  { id: "6", text: "Running TypeScript...", timestamp: "09:42" },
  { id: "7", text: "Finished TypeScript in 2.4s", timestamp: "09:42" },
  { id: "8", text: "✓ Generating static pages (42/42)", variant: "info", timestamp: "09:42" },
  { id: "9", text: "Warning: unused import in layout.tsx", variant: "warning", timestamp: "09:42" },
  { id: "10", text: "Build complete.", timestamp: "09:42" },
];

export function LogTerminalDemo() {
  const [lines, setLines] = useState<LogLine[]>([]);

  // Simulate streaming log output
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < sampleLines.length) {
        setLines((prev) => [...prev, sampleLines[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <Showcase>
      <div className="p-4">
        <LogTerminal lines={lines} title="build output" maxHeight="250px" />
      </div>
    </Showcase>
  );
}
