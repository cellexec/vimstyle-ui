import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { DocsSidebar } from "../components/docs-sidebar";
import { DocsHints } from "../components/docs-hints";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar tree={source.pageTree as never} />
      <div className="flex-1 min-w-0">
        <DocsLayout
          tree={source.pageTree}
          nav={{ title: "vimstyle-ui" }}
          sidebar={{ enabled: false }}
        >
          {children}
          <DocsHints />
        </DocsLayout>
      </div>
    </div>
  );
}
