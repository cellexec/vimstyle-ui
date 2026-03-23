"use client";

import React from "react";
import { VimPage } from "@/components/vim-page";
import { ComponentPreview } from "./component-preview";

export function VimPageDemo() {
  return (
    <ComponentPreview className="h-[300px]">
      <VimPage
        title="Projects"
        subtitle="All your active projects"
        hints={[
          { keys: ["j", "k"], label: "navigate" },
          { keys: "/", label: "search" },
          { keys: "Enter", label: "open" },
          { keys: "n", label: "new" },
          { keys: "Esc", label: "back" },
        ]}
      >
        <div className="space-y-3">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-sm text-zinc-400">
              Content goes here — typically a VimList with items.
            </p>
          </div>
        </div>
      </VimPage>
    </ComponentPreview>
  );
}
