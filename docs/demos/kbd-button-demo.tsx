"use client";

import React, { useState } from "react";
import { KbdButton } from "@/components/kbd-button";
import { ComponentPreview } from "./component-preview";

export function KbdButtonDemo() {
  const [count, setCount] = useState(0);

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="flex items-center gap-3">
          <KbdButton
            shortcut="n"
            onClick={() => setCount((c) => c + 1)}
            variant="primary"
          >
            New Project
          </KbdButton>
          <KbdButton shortcut="s" onClick={() => setCount(0)}>
            Reset
          </KbdButton>
        </div>
        {count > 0 && (
          <p className="text-sm text-zinc-400">
            Clicked <span className="text-violet-400 font-medium">{count}</span>{" "}
            {count === 1 ? "time" : "times"} — try pressing{" "}
            <kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[10px] text-violet-400">
              n
            </kbd>
          </p>
        )}
      </div>
    </ComponentPreview>
  );
}
