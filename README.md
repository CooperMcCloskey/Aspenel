# Aspenel

## A comprehensive, fully-customizeable information organizer.

Aspenel is a desktop app for organizing information as a tree of **branches**. Each branch is a folder on disk, so your data stays in plain JSON files you own. Branches carry typed **properties** (text, numbers, dates, selects), and their contents are shown through **modules** — views like icon grids and tables that you arrange on the screen yourself.

> **Status:** early development. Data formats and features change often.

Built with [Tauri 2](https://v2.tauri.app) (Rust backend) and [SvelteKit](https://svelte.dev) with Svelte 5 (frontend).

## Getting started

Prerequisites: [Node.js](https://nodejs.org), a stable [Rust](https://rustup.rs) toolchain, and the [Tauri system prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS.

```bash
npm install
npm run tauri dev     # run the app with hot reload
npm run tauri build   # produce a release build
```

## Scripts

| Command | What it does |
|---|---|
| `npm run tauri dev` | Runs the desktop app in development mode. |
| `npm run check` | Type-checks the frontend with `svelte-check`. |
| `npm run gen-bindings` | Regenerates `src/lib/bindings.ts` from the Rust types (tauri-specta), then post-processes it. Run after changing any Rust type the frontend uses. |
| `npm run gen-theme` | Regenerates `systemTheme.css` and `systemTheme.ts` from `systemTheme.json`, then the bindings. Run after editing the theme. |

## Project structure

```
src-tauri/src/
  data/            Rust data model: branches, properties, modules, colors, settings
  filesystem/      Tauri commands for reading and writing branches and settings
  error_handling/  Errors returned to the frontend
src/
  lib/
    bindings.ts    Generated TypeScript types and command wrappers — do not edit
    components/    Shared Svelte components (inputs, menus, color pickers, modules)
    data/          Frontend logic per data type (branches, properties, colors)
    logic/         App state: the undoable state manager and settings
    styling/       systemTheme.json (source) and the generated CSS/TS
  routes/          Pages: home, branch view, settings
scripts/           Theme and bindings generators
```

## How data is stored

Everything lives in the app's data directory (on macOS, `~/Library/Application Support/com.coopermccloskey.aspenel/`):

- `settings.json` — theme colors, light/dark scheme, and other preferences.
- `Home/` — the root branch. Every branch is a folder containing a `branch.json` (its id, color and property values); child branches are subfolders.
- `rootdata.json` — present in branches that define their own property schemas and modules.

A branch without its own color inherits the color of its nearest ancestor that has one.

## Conventions

- **Generated files:** `bindings.ts`, `systemTheme.css` and `systemTheme.ts` are generated — change the Rust types or `systemTheme.json` and rerun the matching script instead of editing them.
- **Naming:** JSON and TypeScript use camelCase; CSS variables use kebab-case (`--standard-text`, `--grid-rows`).
- **State changes:** edits to branch data go through `stateManager.applyCommand(...)` so they can be undone, redone and saved.
