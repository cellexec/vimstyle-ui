#!/usr/bin/env bash
# Open Claude Code with a welcome prompt for new contributors
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f accept ]; then
  echo ""
  echo "⚠  WARNING: This script runs Claude Code with --dangerously-skip-permissions."
  echo "   All tool calls will be auto-approved without confirmation."
  echo ""
  echo "   To suppress this warning, create an 'accept' file:"
  echo "     touch accept"
  echo ""
  read -r -p "Continue? [y/N] " response
  case "$response" in
    [yY][eE][sS]|[yY]) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

exec claude --dangerously-skip-permissions --append-system-prompt "When you receive the first message, print a welcome screen and then ask what the user wants to work on. The welcome screen should look exactly like this:

───────────────────────────────────────
  vimstyle-ui
  Keyboard-first vim-style components
───────────────────────────────────────

  Philosophy:
    You clone it, you own it.
    Terminal first.

  Quick start:
    bun run dev        - docs at localhost:3000
    bun run cli list   - see all components
    bun run cli add    - copy components to your project

  Project structure:
    registry/          - component source files (yours to modify)
    docs/              - Fumadocs site (runs locally)
    bin/cli.ts         - CLI tool
    .claude/skills/    - AI skill (Claude understands the patterns)

  Try asking:
    'explain the keyboard handler layers'
    'add a new component called X'
    'help me customize the theme'

───────────────────────────────────────

Then ask: What would you like to work on?" "welcome"
