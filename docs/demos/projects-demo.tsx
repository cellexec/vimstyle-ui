/**
 * Full "Projects" page demo using ListLayout.
 * Showcases grouped items, fuzzy search, keyboard nav, and action buttons.
 */
"use client";

import React, { useState } from "react";
import { ListLayout } from "@/layouts/list-layout";
import { KbdButton } from "@/components/kbd-button";
import { FuzzyText } from "@/components/fuzzy-text";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ResponsivePreview } from "./responsive-preview";

interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
  description: string;
  updated: string;
}

const projects: Project[] = [
  { id: "1", name: "Marketing Site", status: "active", description: "Company landing page redesign", updated: "2 hours ago" },
  { id: "2", name: "API Gateway", status: "active", description: "Unified API proxy layer", updated: "5 hours ago" },
  { id: "3", name: "Mobile App", status: "active", description: "React Native customer app", updated: "1 day ago" },
  { id: "4", name: "Design System", status: "active", description: "Shared component library", updated: "2 days ago" },
  { id: "5", name: "Analytics Dashboard", status: "active", description: "Internal metrics viewer", updated: "3 days ago" },
  { id: "6", name: "Legacy CMS", status: "archived", description: "Old content management system", updated: "2 weeks ago" },
  { id: "7", name: "Auth Service v1", status: "archived", description: "Deprecated auth microservice", updated: "1 month ago" },
];

export function ProjectsDemo() {
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <ResponsivePreview height={550}>
      <ListLayout
        title="Projects"
        subtitle="All your team projects"
        items={projects}
        keyFn={(p) => p.name}
        groupFn={(p) => (p.status === "active" ? "Active" : "Archived")}
        placeholder="Filter projects…"
        hints={[
          { keys: ["j", "k"], label: "navigate" },
          { keys: "/", label: "search" },
          { keys: "Enter", label: "open" },
          { keys: "n", label: "new" },
          { keys: "d", label: "delete" },
        ]}
        actions={
          <>
            <KbdButton
              shortcut="n"
              variant="primary"
              onClick={() => setToast("New project created")}
            >
              New Project
            </KbdButton>
            <KbdButton
              shortcut="d"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </KbdButton>
          </>
        }
        onSelect={(project) => setToast(`Opened: ${project.name}`)}
        renderItem={(project, { query }) => (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <FuzzyText
                text={project.name}
                query={query}
                className="text-sm text-zinc-200"
              />
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {project.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-zinc-600">
              {project.updated}
            </span>
          </div>
        )}
      />

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          setToast("Project deleted");
        }}
        onCancel={() => setConfirmOpen(false)}
        title="Delete project?"
        description="This action cannot be undone."
      />

      {/* Toast */}
      {toast && (
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
          onAnimationEnd={() => setTimeout(() => setToast(null), 1500)}
        >
          {toast}
        </div>
      )}
    </ResponsivePreview>
  );
}
