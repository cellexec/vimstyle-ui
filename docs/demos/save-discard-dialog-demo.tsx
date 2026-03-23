"use client";

import React, { useState } from "react";
import { SaveDiscardDialog } from "@/components/save-discard-dialog";
import { ComponentPreview } from "./component-preview";

export function SaveDiscardDialogDemo() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-3 p-8">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Open Save/Discard Dialog
        </button>
        {lastAction && (
          <p className="text-sm text-zinc-400">
            Last action: <span className="text-violet-400">{lastAction}</span>
          </p>
        )}
      </div>

      <SaveDiscardDialog
        open={open}
        onSave={() => {
          setLastAction("Saved");
          setOpen(false);
        }}
        onDiscard={() => {
          setLastAction("Discarded");
          setOpen(false);
        }}
        onCancel={() => {
          setLastAction("Cancelled");
          setOpen(false);
        }}
      />
    </ComponentPreview>
  );
}
