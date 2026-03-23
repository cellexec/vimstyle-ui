/**
 * Action button with an embedded keyboard shortcut badge.
 *
 * Registers a global `keydown` listener that fires `onClick` (or navigates to
 * `href`) when the shortcut key is pressed — but only when no input element is
 * focused and no overlay is open.
 */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KbdHint } from "@/components/kbd-hint";

interface KbdButtonProps {
  shortcut: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function KbdButton({
  shortcut,
  onClick,
  href,
  variant = "secondary",
  children,
}: KbdButtonProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire when an input-like element is focused
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Don't fire when an overlay is open
      if (document.querySelector("[data-overlay-open]")) return;

      if (e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        if (onClick) onClick();
        if (href) router.push(href);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, onClick, href, router]);

  const baseClasses =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors";

  const variantClasses =
    variant === "primary"
      ? "bg-violet-600 hover:bg-violet-500 text-white"
      : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300";

  function handleClick() {
    if (onClick) onClick();
    if (href) router.push(href);
  }

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={handleClick}>
      {children}
      <KbdHint size="sm">{shortcut}</KbdHint>
    </button>
  );
}
