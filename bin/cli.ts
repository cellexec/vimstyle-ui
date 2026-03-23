#!/usr/bin/env bun
import { resolve, dirname, basename } from "path";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

// ── Registry ──────────────────────────────────────────────────────────────────
type RegistryEntry = { file: string; deps: string[] };
type RegistrySection = Record<string, RegistryEntry>;

const REGISTRY: Record<string, RegistrySection> = {
  components: {
    "vim-page": {
      file: "registry/components/vim-page.tsx",
      deps: ["kbd-hint"],
    },
    "vim-list": {
      file: "registry/components/vim-list.tsx",
      deps: ["search-bar"],
    },
    "search-bar": {
      file: "registry/components/search-bar.tsx",
      deps: ["kbd-hint"],
    },
    "fuzzy-text": {
      file: "registry/components/fuzzy-text.tsx",
      deps: [],
    },
    "kbd-hint": {
      file: "registry/components/kbd-hint.tsx",
      deps: [],
    },
    "kbd-button": {
      file: "registry/components/kbd-button.tsx",
      deps: ["kbd-hint"],
    },
    "list-item": {
      file: "registry/components/list-item.tsx",
      deps: [],
    },
    "section-header": {
      file: "registry/components/section-header.tsx",
      deps: [],
    },
    "focus-overlay": {
      file: "registry/components/focus-overlay.tsx",
      deps: ["kbd-hint"],
    },
    "confirm-dialog": {
      file: "registry/components/confirm-dialog.tsx",
      deps: ["kbd-hint"],
    },
    "save-discard-dialog": {
      file: "registry/components/save-discard-dialog.tsx",
      deps: ["kbd-hint"],
    },
    "hint-label": {
      file: "registry/components/hint-label.tsx",
      deps: [],
    },
    "nav-indicator": {
      file: "registry/components/nav-indicator.tsx",
      deps: [],
    },
  },
  hooks: {
    "use-vim-navigation": {
      file: "registry/hooks/use-vim-navigation.ts",
      deps: [],
    },
    "use-fuzzy-filter": {
      file: "registry/hooks/use-fuzzy-filter.ts",
      deps: [],
    },
    "use-mouse-interaction": {
      file: "registry/hooks/use-mouse-interaction.ts",
      deps: [],
    },
    "use-scroll-into-view": {
      file: "registry/hooks/use-scroll-into-view.ts",
      deps: [],
    },
    "use-nav-hints": {
      file: "registry/hooks/use-nav-hints.ts",
      deps: [],
    },
  },
  layouts: {
    "list-layout": {
      file: "registry/layouts/list-layout.tsx",
      deps: [
        "vim-page",
        "vim-list",
        "list-item",
        "section-header",
        "fuzzy-text",
        "use-vim-navigation",
        "use-fuzzy-filter",
        "use-mouse-interaction",
        "use-scroll-into-view",
        "fuzzy",
      ],
    },
    "split-layout": {
      file: "registry/layouts/split-layout.tsx",
      deps: [
        "vim-page",
        "vim-list",
        "list-item",
        "section-header",
        "fuzzy-text",
        "use-vim-navigation",
        "use-fuzzy-filter",
        "use-mouse-interaction",
        "use-scroll-into-view",
        "fuzzy",
      ],
    },
    "command-palette": {
      file: "registry/layouts/command-palette.tsx",
      deps: [
        "search-bar",
        "list-item",
        "fuzzy-text",
        "kbd-hint",
        "use-fuzzy-filter",
        "use-scroll-into-view",
        "fuzzy",
      ],
    },
  },
  lib: {
    fuzzy: {
      file: "registry/lib/fuzzy.ts",
      deps: [],
    },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Resolve the root of the vimstyle-ui repo (where `registry/` lives). */
function findRegistryRoot(): string {
  // Walk up from the CLI script itself
  let dir = dirname(resolve(process.argv[1]));
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, "registry"))) return dir;
    dir = dirname(dir);
  }
  console.error(
    "\x1b[31mError:\x1b[0m Could not find registry/ directory. Are you running from the vimstyle-ui repo?"
  );
  process.exit(1);
}

/** Find an entry across all registry sections. */
function findEntry(name: string): { section: string; entry: RegistryEntry } | null {
  for (const [section, entries] of Object.entries(REGISTRY)) {
    if (entries[name]) return { section, entry: entries[name] };
  }
  return null;
}

/** Target directory for a given section. */
function targetDir(section: string): string {
  switch (section) {
    case "components":
      return "components/vimstyle";
    case "hooks":
      return "hooks/vimstyle";
    case "layouts":
      return "layouts/vimstyle";
    case "lib":
      return "lib/vimstyle";
    default:
      return `${section}/vimstyle`;
  }
}

/** Rewrite imports so they point into the vimstyle/ subdirectories. */
function rewriteImports(source: string): string {
  return source
    .replace(/@\/components\//g, "@/components/vimstyle/")
    .replace(/@\/hooks\//g, "@/hooks/vimstyle/")
    .replace(/@\/layouts\//g, "@/layouts/vimstyle/")
    .replace(/@\/lib\//g, "@/lib/vimstyle/");
}

/** Recursively collect all dependency names for a list of items. */
function collectDeps(names: string[], seen = new Set<string>()): string[] {
  const all: string[] = [];
  for (const name of names) {
    if (seen.has(name)) continue;
    seen.add(name);
    all.push(name);
    const found = findEntry(name);
    if (found && found.entry.deps.length > 0) {
      all.push(...collectDeps(found.entry.deps, seen));
    }
  }
  return all;
}

// ── Commands ──────────────────────────────────────────────────────────────────

function cmdInit() {
  const registryRoot = findRegistryRoot();
  const cwd = process.cwd();

  console.log(`\n${bold("vimstyle-ui")} ${dim("init")}\n`);

  // Create target directories
  const dirs = ["components/vimstyle", "hooks/vimstyle", "layouts/vimstyle", "lib/vimstyle"];
  for (const d of dirs) {
    const full = resolve(cwd, d);
    mkdirSync(full, { recursive: true });
    console.log(`  ${green("\u2713")} ${dim("created")} ${d}/`);
  }

  // Copy fuzzy.ts
  const fuzzySource = resolve(registryRoot, "registry/lib/fuzzy.ts");
  const fuzzyTarget = resolve(cwd, "lib/vimstyle/fuzzy.ts");
  if (existsSync(fuzzySource)) {
    const content = rewriteImports(readFileSync(fuzzySource, "utf-8"));
    writeFileSync(fuzzyTarget, content);
    console.log(`  ${green("\u2713")} ${dim("copied")}  lib/vimstyle/fuzzy.ts`);
  } else {
    console.log(`  ${yellow("!")} ${dim("registry/lib/fuzzy.ts not found, skipping")}`);
  }

  console.log(`\n${green("Done!")} vimstyle-ui initialized.\n`);
  console.log(
    `  Next: ${cyan("vimstyle-ui add vim-page use-vim-navigation")}\n`
  );
}

function cmdAdd(args: string[]) {
  const registryRoot = findRegistryRoot();
  const cwd = process.cwd();
  const addAll = args.includes("--all");

  let names: string[];

  if (addAll) {
    names = Object.entries(REGISTRY).flatMap(([, entries]) =>
      Object.keys(entries)
    );
  } else {
    names = args.filter((a) => !a.startsWith("-"));
    if (names.length === 0) {
      console.error(
        "\x1b[31mError:\x1b[0m Specify component names or use --all.\n"
      );
      console.log(`  Usage: ${cyan("vimstyle-ui add <component> [...]")}`);
      console.log(`         ${cyan("vimstyle-ui add --all")}\n`);
      process.exit(1);
    }

    // Validate names
    for (const name of names) {
      if (!findEntry(name)) {
        console.error(
          `\x1b[31mError:\x1b[0m Unknown component "${name}". Run ${cyan(
            "vimstyle-ui list"
          )} to see available items.\n`
        );
        process.exit(1);
      }
    }
  }

  // Resolve deps
  const resolved = collectDeps(names);

  console.log(`\n${bold("vimstyle-ui")} ${dim("add")}\n`);

  const copied: string[] = [];

  for (const name of resolved) {
    const found = findEntry(name);
    if (!found) continue;

    const { section, entry } = found;
    const sourceFile = resolve(registryRoot, entry.file);
    const fileName = basename(entry.file);
    const target = resolve(cwd, targetDir(section), fileName);

    if (!existsSync(sourceFile)) {
      console.log(
        `  ${yellow("!")} ${dim("source missing:")} ${entry.file}`
      );
      continue;
    }

    mkdirSync(dirname(target), { recursive: true });

    const content = rewriteImports(readFileSync(sourceFile, "utf-8"));
    writeFileSync(target, content);

    const relTarget = `${targetDir(section)}/${fileName}`;
    console.log(`  ${green("\u2713")} ${name} ${dim(`\u2192 ${relTarget}`)}`);
    copied.push(name);
  }

  console.log(
    `\n${green("Done!")} Added ${copied.length} item${copied.length === 1 ? "" : "s"}.\n`
  );
}

function cmdList() {
  console.log(`\n${bold("vimstyle-ui")} ${dim("registry")}\n`);

  for (const [section, entries] of Object.entries(REGISTRY)) {
    const label = section.charAt(0).toUpperCase() + section.slice(1);
    console.log(`  ${bold(label)}`);
    for (const [name, entry] of Object.entries(entries)) {
      const deps =
        entry.deps.length > 0 ? dim(` (deps: ${entry.deps.join(", ")})`) : "";
      console.log(`    ${cyan(name.padEnd(24))}${dim(entry.file)}${deps}`);
    }
    console.log();
  }
}

function printUsage() {
  console.log(`
${bold("vimstyle-ui")} ${dim("v0.1.0")} -- keyboard-first vim-style components

${bold("Usage:")}
  vimstyle-ui ${cyan("init")}              Initialize vimstyle-ui in current project
  vimstyle-ui ${cyan("add")} <component>   Add a component to your project
  vimstyle-ui ${cyan("add")} --all         Add all components
  vimstyle-ui ${cyan("list")}              List available components
`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case "init":
    cmdInit();
    break;
  case "add":
    cmdAdd(rest);
    break;
  case "list":
    cmdList();
    break;
  case "--help":
  case "-h":
  case undefined:
    printUsage();
    break;
  default:
    console.error(`\x1b[31mUnknown command:\x1b[0m ${command}\n`);
    printUsage();
    process.exit(1);
}
