# vimstyle-ui

**Keyboard-first vim-style components for Next.js**

---

> **"You clone it, you own it."** Fork this repo. The components are yours. Modify freely -- no version lock-in, no npm dependency hell.
>
> **"Terminal first."** Everything flows through the keyboard. The UI is navigated with `j`/`k`, the CLI copies components from your terminal, the docs run locally.

---

## What is this?

A [shadcn](https://ui.shadcn.com)-style component library for building keyboard-navigable, dark-theme UIs. This is **not** an npm package -- you clone the repo and the source is yours. Built on Next.js + Tailwind CSS v4, inspired by vim keybindings.

Every component is designed around one idea: **the keyboard is primary.** Lists navigate with `j`/`k`, search triggers with `/`, actions fire with `Enter`, and `Esc` always gets you out. Mouse support is there, but it is secondary.

## Quick start

```bash
# Fork & clone
git clone https://github.com/cellexec/vimstyle-ui.git
cd vimstyle-ui
bun install

# Run docs locally
bun run dev

# Add components to your project
cd /path/to/your-nextjs-app
bunx vimstyle-ui init
bunx vimstyle-ui add vim-page vim-list use-vim-navigation
```

## CLI

The CLI copies components from the registry into your project, rewriting imports to use `@/components/vimstyle/`, `@/hooks/vimstyle/`, and `@/lib/vimstyle/` paths. Dependencies are resolved automatically.

```
Usage:
  vimstyle-ui init              Initialize vimstyle-ui in current project
  vimstyle-ui add <component>   Add a component to your project
  vimstyle-ui add --all         Add all components
  vimstyle-ui list              List available components
```

## Components

| Component | Description |
|---|---|
| `vim-page` | Full-page layout shell with header, scrollable content, and keyboard hint bar |
| `vim-list` | Keyboard-navigable list with fuzzy search, j/k navigation, and selection state |
| `search-bar` | Fuzzy search input with `/` shortcut badge and escape-to-clear |
| `fuzzy-text` | Inline text renderer that highlights fuzzy-matched characters |
| `kbd-hint` | Styled keyboard shortcut badge (violet-tinted) |
| `kbd-button` | Action button with built-in keyboard shortcut listener |
| `list-item` | List row with three visual states: default, selected (violet), editing (amber) |
| `section-header` | Sticky section label for grouped lists |
| `focus-overlay` | Near-full-screen overlay panel for immersive content (chat, history) |
| `confirm-dialog` | Centered confirmation modal with Enter/Esc keyboard control |
| `save-discard-dialog` | Unsaved-changes dialog with Enter (save), q (discard), Esc (cancel) |

## Hooks

| Hook | Description |
|---|---|
| `use-vim-navigation` | Core keyboard handler with the six-layer priority system |
| `use-fuzzy-filter` | Fuzzy match + filter logic for lists |
| `use-mouse-interaction` | Mouse activation guard that prevents accidental hover-select on load |
| `use-scroll-into-view` | Auto-scrolls the selected item into the viewport |

## Lib

| Module | Description |
|---|---|
| `fuzzy` | Pure functions: `fuzzyMatch`, `fuzzyIndices` for substring matching |

## AI Integration

This repo ships with a **Claude Code skill** (`.claude/skills/vimstyle-ui/SKILL.md`). When you work with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) on a fork of this repo, it automatically understands the full vimstyle pattern -- layout structure, keyboard handler layers, component APIs, and styling conventions.

If you are not forking the repo but want Claude Code to understand the pattern in your own project, you can install the skill standalone:

```bash
# Copy the skill into your project
mkdir -p .claude/skills/vimstyle-ui
cp path/to/vimstyle-ui/.claude/skills/vimstyle-ui/SKILL.md .claude/skills/vimstyle-ui/
```

Claude Code will then use the skill whenever you ask it to build vim-style pages, add keyboard navigation, or create new components following this pattern.

## Running the docs

The documentation site is built with [Fumadocs](https://fumadocs.vercel.app) and lives in the `docs/` directory.

```bash
bun run dev  # starts Fumadocs at localhost:3000
```

Docs are part of the project, not a separate deployment. Fork the repo and they are yours to extend.

## Tech stack

- [Next.js 15](https://nextjs.org) -- App Router
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Fumadocs](https://fumadocs.vercel.app) -- documentation framework
- [Bun](https://bun.sh) -- runtime and package manager

## License

[MIT](./LICENSE) -- cellexec 2026
