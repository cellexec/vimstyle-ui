"use client";

import React from "react";

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentPreview({
  children,
  className = "",
}: ComponentPreviewProps) {
  return (
    <div className="not-prose my-6">
      <div
        className={`relative rounded-xl border border-white/[0.08] bg-zinc-950 overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
