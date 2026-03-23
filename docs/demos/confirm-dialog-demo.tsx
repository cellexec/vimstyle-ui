"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ComponentPreview } from "./component-preview";

export function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-3 p-8">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Open Confirm Dialog
        </button>
        {lastAction && (
          <p className="text-sm text-zinc-400">
            Last action: <span className="text-violet-400">{lastAction}</span>
          </p>
        )}
      </div>

      <ConfirmDialog
        open={open}
        onConfirm={() => {
          setLastAction("Confirmed");
          setOpen(false);
        }}
        onCancel={() => {
          setLastAction("Cancelled");
          setOpen(false);
        }}
        title="Delete project?"
        description="This action cannot be undone. The project and all its data will be permanently removed."
      />
    </ComponentPreview>
  );
}
