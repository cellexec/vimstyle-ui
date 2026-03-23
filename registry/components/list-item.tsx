/**
 * A selectable / editable list row with three visual states driven by a
 * left-border colour, background tint, and a small dot indicator.
 *
 * - **default** — transparent
 * - **selected** — violet tint + violet dot + Enter kbd hint
 * - **editing** — amber tint + amber dot
 */
"use client";

import React from "react";
import { KbdHint } from "@/components/kbd-hint";

interface ListItemProps {
  selected: boolean;
  editing?: boolean;
  onClick?: () => void;
  onMouseMove?: () => void;
  children: React.ReactNode;
  index: number;
}

export function ListItem({
  selected,
  editing = false,
  onClick,
  onMouseMove,
  children,
  index,
}: ListItemProps) {
  let borderColor = "border-transparent";
  let bg = "bg-transparent";
  let dotColor = "";

  if (editing) {
    borderColor = "border-amber-400";
    bg = "bg-amber-500/[0.06]";
    dotColor = "bg-amber-400";
  } else if (selected) {
    borderColor = "border-violet-400";
    bg = "bg-violet-500/[0.06]";
    dotColor = "bg-violet-400";
  }

  return (
    <div
      data-item-index={index}
      onClick={onClick}
      onMouseMove={onMouseMove}
      className={`group relative flex items-center gap-3 border-l-2 ${borderColor} ${bg} px-6 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]`}
    >
      {/* Dot indicator */}
      {(selected || editing) && (
        <span
          className={`absolute left-3 h-1.5 w-1.5 rounded-full ${dotColor}`}
        />
      )}

      <div className="flex-1 min-w-0">{children}</div>

      {/* Enter hint when selected (not editing) */}
      {selected && !editing && (
        <div className="shrink-0">
          <KbdHint size="sm">Enter</KbdHint>
        </div>
      )}
    </div>
  );
}
