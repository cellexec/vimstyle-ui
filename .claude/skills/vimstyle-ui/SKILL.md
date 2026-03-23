---
name: vimstyle-ui
description: "Build keyboard-first vim-style UI pages with fuzzy search, j/k navigation, and kbd hints. Triggers on: vimstyle ui, vim style, vim navigation, keyboard navigation page, add vim keys, make it vim-like."
---

# VimStyle UI

Build pages following the RenLab vim-style keyboard-first UI/UX pattern. Every page must be fully navigable without a mouse.

---

## Header & Bar Styling

All page headers (top bar) and bottom hint bars use a **solid `bg-zinc-950`** background with **`border-white/[0.06]`** borders to match the sidebar. Never use `border-zinc-800` — always use `border-white/[0.06]` for consistency. The page root div should NOT set `bg-zinc-950` (the global layout gradient handles the background). The root layout applies a subtle violet/blue gradient globally.

---

## Layout Template

Every page uses a full-height flex column with four sections:

```tsx
<div className="flex h-full flex-col text-zinc-100">
  {/* 1. Header — shrink-0, solid bg + border to match sidebar */}
  <div className="shrink-0 border-b border-white/[0.06] bg-zinc-950 px-6 py-4">
    <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Page Title</h1>
    <p className="mt-0.5 text-[12px] text-zinc-500">Subtitle</p>
  </div>

  {/* 2. Content area — p-8 gap-5 with boxed panels */}
  <div className="flex-1 min-h-0 overflow-hidden p-8 gap-5">
    {/* Boxed panel — rounded border, semi-transparent bg */}
    <div className="flex flex-col min-h-0 rounded-xl border-2 border-white/[0.08] bg-zinc-950/60 overflow-hidden">
      {/* Search bar inside box */}
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {!searchFocused && !query && (
            <kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-400">/</kbd>
          )}
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Filter items…"
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
        </div>
      </div>

      {/* Scrollable list inside box */}
      <div ref={listRef} className="flex-1 overflow-y-auto min-h-0">
        {/* Items go here */}
      </div>
    </div>
  </div>

  {/* 3. Bottom hints — shrink-0, solid bg + border to match header */}
  <div className="shrink-0 border-t border-white/[0.06] bg-zinc-950 px-6 py-2 flex items-center gap-4 text-[11px] text-zinc-600">
    <span><kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[9px] font-medium text-violet-400">j</kbd> <kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[9px] font-medium text-violet-400">k</kbd> navigate</span>
    <span><kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[9px] font-medium text-violet-400">Enter</kbd> action</span>
    <span><kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[9px] font-medium text-violet-400">/</kbd> search</span>
    <span><kbd className="rounded bg-violet-500/15 border border-violet-500/20 px-1 py-0.5 text-[9px] font-medium text-violet-400">Esc</kbd> back</span>
  </div>
</div>
```

### Spacing rules:
- **Content area**: `p-8` padding around boxed panels (generous spacing to show background gradient), `gap-5` between multiple panels
- **Boxed panels**: `rounded-xl border-2 border-white/[0.08] bg-zinc-950/60 overflow-hidden`
- **Search bar inside box**: `border-b border-white/[0.06] px-4 py-2.5`
- **List items**: `border-b border-white/[0.04] px-4 py-2.5`
- **Split pane**: Use `flex` with `w-[60%]` + `flex-1` or similar ratios
- **Kbd hints**: Use violet-tinted style: `rounded bg-violet-500/15 border border-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-400`

---

## List Item States

Three visual states using left border + background tint + dot indicator:

```tsx
<div className={`border-b border-white/[0.04] px-6 py-3 transition-colors cursor-pointer ${
  isEditing
    ? "bg-amber-500/[0.06] border-l-2 border-l-amber-500/60"    // Editing: amber
    : isSelected
      ? "bg-violet-500/[0.04] border-l-2 border-l-violet-500/60" // Selected: violet
      : "border-l-2 border-l-transparent hover:bg-white/[0.02]"  // Default
}`}>
  <div className="flex items-center gap-3 max-w-xl">
    {/* Dot indicator */}
    <div className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
      isEditing ? "bg-amber-400" : isSelected ? "bg-violet-400" : "bg-transparent"
    }`} />
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <FuzzyText text={item.title} query={query} className="text-[13px] font-medium text-zinc-200" />
        {isSelected && (
          <kbd className="rounded bg-zinc-800 px-1 py-0.5 text-[9px] font-medium text-zinc-600">Enter</kbd>
        )}
      </div>
      <FuzzyText text={item.description} query={query} className="text-[11px] text-zinc-500 block mt-0.5" highlightClass="text-violet-400 font-medium" />
    </div>
  </div>
</div>
```

---

## Section Headers (Sticky)

Group items with sticky section labels:

```tsx
<div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm border-b border-white/[0.04] px-6 py-2">
  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{section}</span>
</div>
```

---

## Fuzzy Search Functions

Every page needs these three functions:

```tsx
function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = lower.indexOf(q[qi], ti);
    if (idx === -1) return false;
    ti = idx + 1;
  }
  return true;
}

function fuzzyIndices(text: string, query: string): Set<number> | null {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const indices = new Set<number>();
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = lower.indexOf(q[qi], ti);
    if (idx === -1) return null;
    indices.add(idx);
    ti = idx + 1;
  }
  return indices;
}

function FuzzyText({ text, query, className, highlightClass }: {
  text: string; query: string; className?: string; highlightClass?: string;
}) {
  if (!query) return <span className={className}>{text}</span>;
  const indices = fuzzyIndices(text, query);
  if (!indices || indices.size === 0) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {Array.from(text).map((ch, i) =>
        indices.has(i) ? (
          <span key={i} className={highlightClass ?? "text-violet-300 font-semibold"}>{ch}</span>
        ) : (<span key={i}>{ch}</span>)
      )}
    </span>
  );
}
```

---

## Keyboard Handler Pattern

Register on `window` with capture phase. Six-layer structure:

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    // LAYER 1: Save/discard dialog (highest priority)
    if (showSaveDiscardDialog) {
      if (e.key === "Enter") { e.preventDefault(); handleSave(); setShowSaveDiscardDialog(false); setEditingId(null); }
      else if (e.key === "q") { e.preventDefault(); resetValues(); setShowSaveDiscardDialog(false); setEditingId(null); }
      else if (e.key === "Escape") { e.preventDefault(); setShowSaveDiscardDialog(false); /* stay in edit mode */ }
      return;
    }

    // LAYER 2: Confirmation dialog
    if (confirmDialog) {
      if (e.key === "Enter") { e.preventDefault(); handleConfirm(); setConfirmDialog(false); }
      else if (e.key === "Escape") { e.preventDefault(); setConfirmDialog(false); }
      return;
    }

    // LAYER 3: Focus overlay panel (chat, history, etc.)
    if (overlayPanel) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOverlayPanel(null);
      }
      // Other overlay-specific keys here
      return;
    }

    // LAYER 4: Search focused — handle Escape, Enter (blur only), arrows
    if (searchFocused) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (query) { setQuery(""); } else { searchRef.current?.blur(); setSearchFocused(false); }
      } else if (e.key === "Enter") {
        e.preventDefault();
        searchRef.current?.blur();  // Exit search, do NOT act on item
        setSearchFocused(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      return;
    }

    // LAYER 5: Editing mode — Escape triggers save/discard if changes exist
    if (editingId) {
      if (e.key === "Enter") {
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();
        if (hasChanges) handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (hasChanges) {
          setShowSaveDiscardDialog(true); // Show save/discard dialog instead of silently discarding
        } else {
          setEditingId(null);
          (document.activeElement as HTMLElement)?.blur();
        }
      }
      return;
    }

    // LAYER 6: List navigation — skip if in an input
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === "/") { e.preventDefault(); setSearchFocused(true); requestAnimationFrame(() => searchRef.current?.focus()); }
    else if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "k" || e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "Tab" && e.shiftKey) { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); /* act on filtered[selectedIndex] */ }
    else if (e.key === "Escape") { e.preventDefault(); router.back(); }
    // Page-specific single-letter shortcuts here (n, a, i, h, l, etc.)
  };

  window.addEventListener("keydown", handler, true);
  return () => window.removeEventListener("keydown", handler, true);
}, [searchFocused, query, filtered, selectedIndex, showSaveDiscardDialog, confirmDialog, overlayPanel, /* page-specific deps */]);
```

### Layer order summary:
1. **Save/discard dialog** (if showing) — Enter saves, `q` discards, Esc cancels
2. **Confirmation dialog** (if showing) — Enter confirms, Esc cancels
3. **Focus overlay panel** (if open) — Esc closes
4. **Search focused** — Esc clears/blurs, Enter blurs, arrows navigate
5. **Editing mode** — Esc triggers save/discard if changes exist
6. **List navigation** — j/k, Enter, /, Esc, page-specific shortcuts

### Critical rules:
- **Enter in search ONLY blurs** — never acts on the item. User must press Enter again in list mode.
- **Space for toggling** must call `e.stopImmediatePropagation()` to prevent sidebar nav hints.
- **Escape** clears query first, then blurs on second press if query was empty.
- **All handlers use capture phase** (`true` as third argument).
- **Guard clause**: Always check `tagName` to skip INPUT/TEXTAREA/SELECT in list mode.
- **Dialogs block all lower layers** — when a dialog is open, only dialog keys are handled.

---

## Scroll Into View

Always scroll the selected item into view with smooth scrolling:

```tsx
useEffect(() => {
  if (!listRef.current) return;
  const el = listRef.current.querySelector(
    `[data-item-index="${selectedIndex}"]`
  ) as HTMLElement | null;
  el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}, [selectedIndex]);
```

Use `data-item-index` attributes on list items for reliable targeting, especially when sticky headers or grouped sections break the simple `children[index]` approach.

---

## Mouse Interaction

Prevent accidental mouse selection on page load (cursor may be stationary over an item):

```tsx
const [mouseActive, setMouseActive] = useState(false);
const lastMousePos = useRef({ x: 0, y: 0 });

useEffect(() => {
  const handler = (e: MouseEvent) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (!mouseActive && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) setMouseActive(true);
  };
  window.addEventListener("mousemove", handler);
  return () => window.removeEventListener("mousemove", handler);
}, [mouseActive]);

// On items:
onMouseMove={() => { if (mouseActive && selectedIndex !== i) setSelectedIndex(i); }}
```

---

## KbdButton Component

Use `KbdButton` from `app/components/ui` for action buttons with built-in shortcut:

```tsx
import { KbdButton } from "../components/ui";

<KbdButton shortcut="n" href="/specifications/new">
  <PlusIcon /> New Spec
</KbdButton>
```

Variants: `"primary"` (violet) or `"secondary"` (glass). Registers global keydown listener automatically.

---

## Focus Overlay Pattern

For chat, history, or any immersive panel that needs user focus. Uses near-full-screen overlay instead of side-panel slide-ins:

```tsx
{overlayOpen && (
  <>
    <div data-overlay-open className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOverlayOpen(false)} />
    <div
      className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
      style={{ animation: "overlayScaleIn 0.2s ease-out" }}
    >
      {/* Header with icon, title, close button */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-violet-400">{icon}</span>
          <span className="text-sm font-semibold text-zinc-200">{title}</span>
        </div>
        <button onClick={() => setOverlayOpen(false)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all">
          <span className="text-[11px]">Close</span>
          <kbd className="text-[10px] font-mono text-zinc-600 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">Esc</kbd>
        </button>
      </div>
      {/* Content fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  </>
)}
```

Animation keyframe (add to global CSS or a `<style>` tag):
```css
@keyframes overlayScaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
```

Key design: `fixed inset-4 md:inset-8 lg:inset-12` uses most of the screen while still showing the blurred page behind. Esc closes via the keyboard handler (Layer 3).

---

## Confirmation Dialog Pattern

Centered modal for important actions (pipeline triggers, destructive operations). Replaces inline buttons:

```tsx
{confirmDialog && (
  <>
    <div data-overlay-open className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDialog(false)} />
    <div
      className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px]"
      style={{ animation: "dialogScaleIn 0.2s ease-out" }}
    >
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/95 backdrop-blur-2xl p-6 shadow-2xl">
        <h2 className="text-sm font-medium text-zinc-300 mb-2">{title}</h2>
        <p className="text-[13px] text-zinc-500 mb-5">{description}</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-400/20 text-sm font-medium hover:bg-violet-500/30 transition-colors">
            <kbd className="rounded bg-violet-500/25 px-1.5 py-0.5 text-[9px] font-medium text-violet-400">Enter</kbd>
            Confirm
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">Esc</kbd>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
)}
```

Animation keyframe:
```css
@keyframes dialogScaleIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
```

Keyboard: Enter confirms, Esc cancels. Additional keys can be bound (e.g., `q` for discard). Handled in keyboard handler Layer 2.

---

## Save/Discard Dialog Pattern

When leaving edit mode with unsaved changes, show a dialog instead of silently discarding. Uses the same visual pattern as the confirmation dialog but with two actions:

- **Enter** — Save changes and exit edit mode
- **q** — Discard changes and exit edit mode
- **Esc** — Cancel (stay in edit mode)

```tsx
{showSaveDiscardDialog && (
  <>
    <div data-overlay-open className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowSaveDiscardDialog(false)} />
    <div
      className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px]"
      style={{ animation: "dialogScaleIn 0.2s ease-out" }}
    >
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/95 backdrop-blur-2xl p-6 shadow-2xl">
        <h2 className="text-sm font-medium text-zinc-300 mb-2">Unsaved changes</h2>
        <p className="text-[13px] text-zinc-500 mb-5">You have unsaved changes. Save or discard?</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-400/20 text-sm font-medium hover:bg-violet-500/30 transition-colors">
            <kbd className="rounded bg-violet-500/25 px-1.5 py-0.5 text-[9px] font-medium text-violet-400">Enter</kbd>
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">q</kbd>
            Discard
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">Esc</kbd>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
)}
```

This dialog is triggered in the keyboard handler Layer 5 when Escape is pressed in editing mode with unsaved changes. Handled at the highest priority (Layer 1).

---

## Input Focus on Mode Change

When entering edit mode or opening an overlay, automatically focus the relevant input. Use `requestAnimationFrame` to ensure the DOM has updated:

```tsx
// When pressing 'e' to edit:
setEditorViewOnly(false);
requestAnimationFrame(() => {
  const textarea = document.querySelector('[data-spec-editor] textarea');
  if (textarea) (textarea as HTMLElement).focus();
});

// When opening an overlay that has an input:
setOverlayPanel("chat");
requestAnimationFrame(() => {
  const chatInput = document.querySelector('.overlay-panel textarea, .overlay-panel input');
  if (chatInput) (chatInput as HTMLElement).focus();
});
```

Key principle: any mode change that involves an input should auto-focus that input after a `requestAnimationFrame`.

---

## Sidebar Nav Hints Suppression

When any dialog or overlay is open, the sidebar Space-triggered navigation hints (`useNavHints`) must be disabled. Mark every overlay/dialog backdrop with `data-overlay-open`:

```tsx
<div data-overlay-open className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" ... />
```

The `useNavHints` hook checks for this attribute before activating:

```tsx
if (document.querySelector("[data-overlay-open]")) return;
```

**Critical rule:** Every overlay backdrop (focus overlays, confirmation dialogs, save/discard dialogs) must include the `data-overlay-open` attribute on its backdrop `div`.

---

## Required State

Minimum state for any vimstyle page:

```tsx
const [selectedIndex, setSelectedIndex] = useState(0);
const [query, setQuery] = useState("");
const [searchFocused, setSearchFocused] = useState(false);
const searchRef = useRef<HTMLInputElement>(null);
const listRef = useRef<HTMLDivElement>(null);
```

Optional (for edit modes): `editingId`, `userMoved`, `mouseActive`.
Optional (for dialogs/overlays): `overlayPanel`, `confirmDialog`, `showSaveDiscardDialog`.

---

## Reference Implementations

Study these pages for the full pattern:
- `/settings` — editable settings list with save/discard
- `/project-selection` — project picker with active state sync
- `/local-dev` — split layout (action list + log viewer)
- `/projects/import-monorepo` — multi-step (browse → select apps)
- `/` dashboard overview — Tab-switchable cards with nested j/k
- `/specifications/[id]` — specification detail page: focus overlays (chat, history), confirmation dialogs (pipeline trigger), save/discard on edit exit
