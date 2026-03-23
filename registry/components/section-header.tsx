/**
 * Sticky group header that sits above a section of list items.
 *
 * Stays pinned to the top of its scroll container with a blurred dark
 * background so content scrolls cleanly underneath.
 */
"use client";

import React from "react";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm border-b border-white/[0.04] px-6 py-2">
      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        {children}
      </span>
    </div>
  );
}
