"use client";

import React, { useState } from "react";
import { ListItem } from "@/components/list-item";
import { ComponentPreview } from "./component-preview";

const items = [
  { name: "Project Alpha", date: "Mar 2026" },
  { name: "Project Bravo", date: "Feb 2026" },
  { name: "Project Charlie", date: "Jan 2026" },
];

export function ListItemDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <ComponentPreview>
      <div className="py-1">
        {items.map((item, i) => (
          <ListItem
            key={item.name}
            index={i}
            selected={i === selectedIndex}
            editing={i === editingIndex}
            onClick={() => {
              if (i === selectedIndex) {
                setEditingIndex(i === editingIndex ? null : i);
              } else {
                setSelectedIndex(i);
                setEditingIndex(null);
              }
            }}
            onMouseMove={() => setSelectedIndex(i)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-200">{item.name}</span>
              <span className="text-xs text-zinc-500">{item.date}</span>
            </div>
          </ListItem>
        ))}
      </div>
      <div className="border-t border-white/[0.06] px-6 py-2">
        <p className="text-[11px] text-zinc-600">
          Click to select — click a selected item again to toggle editing state.
        </p>
      </div>
    </ComponentPreview>
  );
}
