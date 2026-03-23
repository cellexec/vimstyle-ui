/**
 * Date formatting utilities for timestamped lists.
 *
 * - `dayLabel` — "Today", "Yesterday", or "Older"
 * - `timeAgo` — "just now", "5m ago", "2h ago", "3d ago"
 * - `groupByDate` — groups items into `{ label, items }[]`
 */

/** Returns "Today", "Yesterday", or "Older" for a given date. */
export function dayLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return "Older";
}

/** Formats a date as a relative time string. */
export function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/** Groups items by date label, preserving order within groups. */
export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => Date
): { label: string; items: T[] }[] {
  const map: Record<string, T[]> = {};
  const order: string[] = [];

  for (const item of items) {
    const label = dayLabel(getDate(item));
    if (!map[label]) {
      map[label] = [];
      order.push(label);
    }
    map[label].push(item);
  }

  return order.map((label) => ({ label, items: map[label] }));
}
