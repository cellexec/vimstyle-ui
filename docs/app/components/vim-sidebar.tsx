/**
 * Adds vim-style j/k navigation to the fumadocs sidebar.
 *
 * Scans #nd-sidebar for doc links, manages a visual selection with
 * data-vim-selected, and handles j/k/Enter/Esc/slash keybindings.
 * Pure DOM integration — no fumadocs internals modified.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function VimSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  // Scan sidebar for visible doc links
  const scanLinks = useCallback(() => {
    const sidebar = document.getElementById("nd-sidebar");
    if (!sidebar) return [];
    const links = Array.from(
      sidebar.querySelectorAll('a[href^="/docs"]')
    ) as HTMLAnchorElement[];
    linksRef.current = links;
    return links;
  }, []);

  // Apply data-vim-selected to the selected link
  useEffect(() => {
    const links = linksRef.current;
    links.forEach((link, i) => {
      if (i === selectedIndex) {
        link.setAttribute("data-vim-selected", "true");
        link.scrollIntoView({ block: "nearest" });
      } else {
        link.removeAttribute("data-vim-selected");
      }
    });
  }, [selectedIndex]);

  // Reset selection on navigation, rescan after render
  useEffect(() => {
    setSelectedIndex(-1);
    linksRef.current.forEach((link) =>
      link.removeAttribute("data-vim-selected")
    );
    const timer = setTimeout(() => scanLinks(), 150);
    return () => clearTimeout(timer);
  }, [pathname, scanLinks]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const isEditable = (e.target as HTMLElement)?.isContentEditable;
      if (isInput || isEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector("[data-overlay-open]")) return;

      // Don't handle if space-motion or yank mode is active
      // (those set their own indicators in the DOM)
      const indicator = document.querySelector(
        ".fixed.bottom-4.z-\\[9999\\]"
      );
      if (indicator) return;

      const links = linksRef.current;
      if (links.length === 0) scanLinks();
      const count = linksRef.current.length;
      if (count === 0) return;

      switch (e.key) {
        case "j": {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < count - 1 ? prev + 1 : prev
          );
          break;
        }
        case "k": {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        }
        case "Enter": {
          if (selectedIndex >= 0 && linksRef.current[selectedIndex]) {
            e.preventDefault();
            const href =
              linksRef.current[selectedIndex].getAttribute("href");
            if (href) router.push(href);
          }
          break;
        }
        case "/": {
          e.preventDefault();
          // Trigger fumadocs search dialog
          const searchBtn = document.querySelector(
            "[data-search]"
          ) as HTMLButtonElement | null;
          if (searchBtn) searchBtn.click();
          break;
        }
        case "Escape": {
          if (selectedIndex >= 0) {
            e.preventDefault();
            setSelectedIndex(-1);
            linksRef.current.forEach((link) =>
              link.removeAttribute("data-vim-selected")
            );
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, router, scanLinks]);

  return null;
}
