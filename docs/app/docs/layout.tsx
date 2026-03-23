import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { SpaceMotion } from "../components/space-motion";
import { VimSidebar } from "../components/vim-sidebar";
import { DocsHints } from "../components/docs-hints";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{ title: "vimstyle-ui" }}
    >
      {children}
      <SpaceMotion />
      <VimSidebar />
      <DocsHints />
    </DocsLayout>
  );
}
