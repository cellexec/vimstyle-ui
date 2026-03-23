"use client";

import React, { useState } from "react";
import { NotificationPanel } from "@/components/notification-panel";
import type { Notification } from "@/components/notification-panel";
import { Showcase } from "./showcase";

const now = Date.now();

const initialNotifications: Notification[] = [
  { id: "1", title: "Build succeeded", body: "Production deploy complete", timestamp: new Date(now - 300000), read: false },
  { id: "2", title: "PR #42 merged", body: "Add space-motion navigation", timestamp: new Date(now - 1800000), read: false },
  { id: "3", title: "New comment on issue #17", body: "Can we add mobile support?", timestamp: new Date(now - 7200000), read: true },
  { id: "4", title: "CI pipeline failed", body: "Type error in vim-sidebar.tsx", timestamp: new Date(now - 86400000), read: false },
  { id: "5", title: "Release v0.1.0 published", body: "npm package is live", timestamp: new Date(now - 90000000), read: true },
  { id: "6", title: "Dependency update available", body: "fumadocs-ui 16.1 → 16.2", timestamp: new Date(now - 172800000), read: true },
];

export function NotificationPanelDemo() {
  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <Showcase
      hints={[
        { keys: ["j", "k"], label: "navigate" },
        { keys: "/", label: "search" },
        { keys: "r", label: "mark read" },
        { keys: "d", label: "dismiss" },
        { keys: "Enter", label: "select" },
        { keys: "Esc", label: "close" },
      ]}
      className="h-[380px]"
    >
      <NotificationPanel
        notifications={notifications}
        onMarkRead={(n) =>
          setNotifications((prev) =>
            prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
          )
        }
        onDismiss={(n) =>
          setNotifications((prev) => prev.filter((x) => x.id !== n.id))
        }
      />
    </Showcase>
  );
}
