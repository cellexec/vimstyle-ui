"use client";

import React from "react";
import { SectionHeader } from "@/components/section-header";
import { ComponentPreview } from "./component-preview";

export function SectionHeaderDemo() {
  return (
    <ComponentPreview>
      <div className="max-h-[200px] overflow-y-auto">
        <SectionHeader>Active Projects</SectionHeader>
        <div className="px-6 py-3 text-sm text-zinc-400">Project Alpha</div>
        <div className="px-6 py-3 text-sm text-zinc-400">Project Bravo</div>
        <SectionHeader>Archived</SectionHeader>
        <div className="px-6 py-3 text-sm text-zinc-400">Old Project</div>
      </div>
    </ComponentPreview>
  );
}
