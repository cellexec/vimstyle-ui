"use client";

import React, { useState } from "react";

type DeviceSize = "mobile" | "tablet" | "desktop";

const devices: { key: DeviceSize; label: string; width: number | null; icon: React.ReactNode }[] = [
  {
    key: "mobile",
    label: "Mobile",
    width: 375,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    key: "tablet",
    label: "Tablet",
    width: 768,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    key: "desktop",
    label: "Desktop",
    width: null,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    ),
  },
];

interface ResponsivePreviewProps {
  children: React.ReactNode;
  height?: number;
  defaultSize?: DeviceSize;
}

export function ResponsivePreview({
  children,
  height = 600,
  defaultSize = "desktop",
}: ResponsivePreviewProps) {
  const [size, setSize] = useState<DeviceSize>(defaultSize);
  const active = devices.find((d) => d.key === size)!;

  return (
    <div className="not-prose my-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-white/[0.08] bg-zinc-900/80 px-4 py-2">
        <span className="text-xs font-medium text-zinc-500">
          {active.label}
          {active.width && (
            <span className="ml-1.5 text-zinc-600">{active.width}px</span>
          )}
        </span>

        <div className="flex items-center gap-1">
          {devices.map((device) => (
            <button
              key={device.key}
              onClick={() => setSize(device.key)}
              className={`rounded-md p-1.5 transition-colors ${
                size === device.key
                  ? "bg-violet-500/15 text-violet-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
              }`}
              title={device.label}
            >
              {device.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div
        className="flex justify-center rounded-b-xl border border-white/[0.08] bg-zinc-950/40 p-4 overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-950 transition-all duration-300 ease-in-out"
          style={{
            width: active.width ? `${active.width}px` : "100%",
            maxWidth: "100%",
            /* transform creates a containing block for position:fixed children */
            transform: "scale(1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
