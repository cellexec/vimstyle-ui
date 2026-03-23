/**
 * Inline link to a docs page that participates in space-motion navigation.
 *
 * Renders as a styled inline link with a subtle arrow indicator.
 * When space-motion is active, these links can also be targeted
 * via their label prefix — same as sidebar links.
 *
 * Usage in MDX:
 *   <DocLink href="/docs/components/list-item">ListItem</DocLink>
 */
"use client";

import React from "react";
import Link from "next/link";

interface DocLinkProps {
  href: string;
  children: React.ReactNode;
}

export function DocLink({ href, children }: DocLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 rounded-md border border-violet-500/20 bg-violet-500/[0.06] px-1.5 py-0.5 text-[13px] font-medium text-violet-400 transition-colors hover:border-violet-500/40 hover:bg-violet-500/[0.1] hover:text-violet-300"
    >
      {children}
      <svg
        className="h-3 w-3 text-violet-500/50"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
