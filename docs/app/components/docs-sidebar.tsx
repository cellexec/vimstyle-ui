/**
 * Fumadocs sidebar adapter — converts the fumadocs page tree into
 * VimSidebar sections and renders the registry sidebar component.
 */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { VimSidebar } from "@/components/vim-sidebar";
import type { SidebarSection } from "@/components/vim-sidebar";

interface PageTreeItem {
  $id?: string;
  type: "page" | "folder" | "separator";
  name: string;
  url?: string;
  children?: PageTreeItem[];
}

interface PageTree {
  name: string;
  children: PageTreeItem[];
}

/** Recursively flatten a page tree into sidebar sections. */
function treeToSections(tree: PageTree): SidebarSection[] {
  const sections: SidebarSection[] = [];
  let currentSection: SidebarSection = { title: "Docs", items: [] };

  for (const child of tree.children) {
    if (child.type === "separator") {
      // Push current section if it has items
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: child.name, items: [] };
    } else if (child.type === "page" && child.url) {
      currentSection.items.push({
        key: child.url,
        label: child.name === "Index" ? currentSection.title : child.name,
        href: child.url,
      });
    } else if (child.type === "folder" && child.children) {
      // Add folder's index page and children as flat items
      for (const fc of child.children) {
        if (fc.type === "page" && fc.url) {
          currentSection.items.push({
            key: fc.url,
            label: fc.name === "Index" ? child.name : fc.name,
            href: fc.url,
          });
        }
      }
    }
  }

  // Push last section
  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

export function DocsSidebar({ tree }: { tree: PageTree }) {
  const router = useRouter();
  const sections = treeToSections(tree);

  return (
    <VimSidebar
      title="vimstyle-ui"
      sections={sections}
      onNavigate={(href) => router.push(href)}
      logo={
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      }
    />
  );
}
