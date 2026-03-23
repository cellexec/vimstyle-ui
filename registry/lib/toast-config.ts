/**
 * Persist toast notification preferences (position and duration)
 * to localStorage with type-safe getters and setters.
 */

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const POSITION_KEY = "vim-toast-position";
const DURATION_KEY = "vim-toast-duration";
const DEFAULT_POSITION: ToastPosition = "bottom-right";
const DEFAULT_DURATION = 5000;

const VALID_POSITIONS: Set<string> = new Set([
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]);

export function getToastPosition(): ToastPosition {
  if (typeof window === "undefined") return DEFAULT_POSITION;
  const v = localStorage.getItem(POSITION_KEY);
  return v && VALID_POSITIONS.has(v) ? (v as ToastPosition) : DEFAULT_POSITION;
}

export function setToastPosition(position: ToastPosition): void {
  localStorage.setItem(POSITION_KEY, position);
}

export function getToastDuration(): number {
  if (typeof window === "undefined") return DEFAULT_DURATION;
  const v = localStorage.getItem(DURATION_KEY);
  if (!v) return DEFAULT_DURATION;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_DURATION;
}

export function setToastDuration(ms: number): void {
  localStorage.setItem(DURATION_KEY, String(ms));
}
