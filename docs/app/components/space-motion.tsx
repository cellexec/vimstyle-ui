/**
 * Fumadocs sidebar integration for space-motion navigation.
 *
 * Scans the fumadocs sidebar for doc links, computes hint prefixes via
 * useNavHints, and renders floating hint badges + a bottom indicator
 * when Space is pressed.
 */
"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useNavHints } from "@/hooks/use-nav-hints";
import type { NavHintItem } from "@/hooks/use-nav-hints";
import { NavIndicator } from "@/components/nav-indicator";

interface NavTarget extends NavHintItem {
  href: string;
}

export function SpaceMotion() {
  const router = useRouter();
  const pathname = usePathname();
  const [targets, setTargets] = useState<NavTarget[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [rects, setRects] = useState<Map<string, DOMRect>>(new Map());
  const linksRef = useRef<Map<string, Element>>(new Map());

  // Scan sidebar for navigation targets on pathname change
  // Disable when a demo on the page claims Space for itself
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.querySelector("[data-space-motion-disabled]")) {
        setDisabled(true);
        setTargets([]);
        return;
      }
      setDisabled(false);

      const sidebar = document.querySelector("aside");
      if (!sidebar) return;

      const links = sidebar.querySelectorAll('a[href^="/docs"]');
      const items: NavTarget[] = [];
      const seen = new Set<string>();
      const linkElements = new Map<string, Element>();

      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const label = link.textContent?.trim() || "";
        if (!label || !href || seen.has(href)) return;
        seen.add(href);
        items.push({ key: href, label, href });
        linkElements.set(href, link);
      });

      setTargets(items);
      linksRef.current = linkElements;
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleMatch = useCallback(
    (item: NavHintItem) => {
      const target = targets.find((t) => t.key === item.key);
      if (target) router.push(target.href);
    },
    [targets, router]
  );

  const { active, typed, hints, matching, deactivate } = useNavHints({
    items: targets,
    onMatch: handleMatch,
  });

  // Refresh bounding rects when hint mode activates
  useEffect(() => {
    if (!active) {
      setRects(new Map());
      return;
    }
    const newRects = new Map<string, DOMRect>();
    for (const [key, el] of linksRef.current) {
      const rect = el.getBoundingClientRect();
      // Only include links visible in the viewport
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        newRects.set(key, rect);
      }
    }
    setRects(newRects);
  }, [active]);

  // Deactivate on navigation
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      deactivate();
      prevPathname.current = pathname;
    }
  }, [pathname, deactivate]);

  if (!active) return null;

  return (
    <>
      {/* Hint badges overlaid on sidebar links */}
      {targets.map((target) => {
        const hint = hints.get(target.key) ?? "";
        const isMatching = matching.has(target.key);
        const rect = rects.get(target.key);
        if (!rect) return null;

        return (
          <div
            key={target.key}
            className="pointer-events-none fixed z-[9999]"
            style={{
              top: rect.top + rect.height / 2 - 9,
              left: rect.left - 4,
            }}
          >
            <span
              className={`inline-flex items-center justify-center rounded px-1 py-0.5 text-[10px] font-mono font-bold leading-none transition-opacity duration-150 ${
                isMatching
                  ? "border border-violet-500/40 bg-violet-500/20 text-violet-300"
                  : "opacity-20"
              }`}
            >
              {hint.split("").map((char, i) => (
                <span
                  key={i}
                  className={
                    i < typed.length ? "text-violet-500/50" : ""
                  }
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        );
      })}

      <NavIndicator active={active} typed={typed} />
    </>
  );
}
