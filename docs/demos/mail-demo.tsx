/**
 * "Mail Client" demo using SplitLayout.
 * Showcases list + detail pane, sections, and keyboard navigation.
 */
"use client";

import React from "react";
import { SplitLayout } from "@/layouts/split-layout";
import { FuzzyText } from "@/components/fuzzy-text";
import { ResponsivePreview } from "./responsive-preview";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  folder: "inbox" | "sent";
  body: string;
}

const emails: Email[] = [
  {
    id: "1",
    from: "Sarah Chen",
    subject: "Q1 roadmap review",
    preview: "Hey team, I've put together the…",
    time: "10:30 AM",
    folder: "inbox",
    body: "Hey team,\n\nI've put together the Q1 roadmap based on our planning session last week. The key priorities are:\n\n1. Complete the auth migration\n2. Ship the new dashboard\n3. Performance improvements for the API\n\nPlease review and add comments by Friday.\n\nBest,\nSarah",
  },
  {
    id: "2",
    from: "DevOps Bot",
    subject: "Deploy succeeded: api-v2.4.1",
    preview: "Production deployment completed…",
    time: "9:15 AM",
    folder: "inbox",
    body: "Production deployment completed successfully.\n\nService: api-gateway\nVersion: v2.4.1\nEnvironment: production\nDuration: 45s\n\nAll health checks passing.",
  },
  {
    id: "3",
    from: "Alex Rivera",
    subject: "Component library feedback",
    preview: "Love the new vim-style navigation…",
    time: "Yesterday",
    folder: "inbox",
    body: "Love the new vim-style navigation! A few thoughts:\n\n- The keyboard hints are really intuitive\n- Could we add a command palette (Ctrl+K)?\n- The fuzzy search is snappy\n\nGreat work on this.",
  },
  {
    id: "4",
    from: "You",
    subject: "Re: Sprint planning",
    preview: "Thanks for the update. I'll take…",
    time: "Yesterday",
    folder: "sent",
    body: "Thanks for the update. I'll take the auth migration ticket and pair with Jamie on the dashboard.\n\nLet's sync tomorrow morning.",
  },
  {
    id: "5",
    from: "You",
    subject: "Design review notes",
    preview: "Here are my notes from today's…",
    time: "Mon",
    folder: "sent",
    body: "Here are my notes from today's design review:\n\n- Approved: new color palette\n- Needs revision: mobile nav patterns\n- Deferred: dark mode toggle placement\n\nI'll update the Figma file tonight.",
  },
];

export function MailDemo() {
  return (
    <ResponsivePreview height={550}>
      <SplitLayout
        title="Mail"
        subtitle="5 messages"
        items={emails}
        keyFn={(e) => e.subject}
        groupFn={(e) => (e.folder === "inbox" ? "Inbox" : "Sent")}
        placeholder="Filter mail…"
        listWidth="w-2/5"
        hints={[
          { keys: ["j", "k"], label: "navigate" },
          { keys: "/", label: "search" },
          { keys: "Enter", label: "open" },
          { keys: "Esc", label: "back" },
        ]}
        renderItem={(email, { query }) => (
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-zinc-200">
                <FuzzyText text={email.subject} query={query} />
              </span>
              <span className="shrink-0 text-[11px] text-zinc-600">
                {email.time}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">{email.from}</p>
          </div>
        )}
        renderDetail={(email) => (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-zinc-100">
              {email.subject}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
              <span>{email.from}</span>
              <span>·</span>
              <span>{email.time}</span>
            </div>
            <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {email.body}
            </div>
          </div>
        )}
      />
    </ResponsivePreview>
  );
}
