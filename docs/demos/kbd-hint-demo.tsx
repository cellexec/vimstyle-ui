"use client";

import React from "react";
import { KbdHint } from "@/components/kbd-hint";
import { ComponentPreview } from "./component-preview";

export function KbdHintDemo() {
  return (
    <ComponentPreview>
      <div className="flex items-center gap-6 p-8">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">md:</span>
          <KbdHint>Enter</KbdHint>
          <KbdHint>/</KbdHint>
          <KbdHint>Esc</KbdHint>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">sm:</span>
          <KbdHint size="sm">j</KbdHint>
          <KbdHint size="sm">k</KbdHint>
          <KbdHint size="sm">Enter</KbdHint>
        </div>
      </div>
    </ComponentPreview>
  );
}
