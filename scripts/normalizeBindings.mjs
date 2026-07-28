#!/usr/bin/env node
// merge-bindings.mjs
//
// Merges the standalone `types.ts` file produced by `specta::collect()` into
// `bindings.ts` produced by `Builder::export()`, so you end up with a single
// bindings file instead of two. Any type already reachable from a command
// (and therefore already emitted into bindings.ts) is skipped; only the
// "extra" types unique to types.ts get appended. types.ts is deleted after.
//
// Usage: node merge-bindings.mjs [bindingsPath] [typesPath]
// Defaults match the paths in the export() calls from the Rust test.

import fs from "node:fs";
import path from "node:path";

const bindingsPath = path.resolve(process.argv[2] ?? "src/lib/bindings.ts");
const typesPath = path.resolve(process.argv[3] ?? "src/lib/types.ts");

if (!fs.existsSync(bindingsPath)) {
  console.error(`bindings file not found: ${bindingsPath}`);
  process.exit(1);
}
if (!fs.existsSync(typesPath)) {
  console.error(`types file not found: ${typesPath}`);
  process.exit(1);
}

const bindingsSrc = fs.readFileSync(bindingsPath, "utf8");
const typesSrc = fs.readFileSync(typesPath, "utf8");

/**
 * Splits a specta-generated .ts file into top-level named declarations
 * (export type/interface/enum/const/function/class NAME ...).
 *
 * Rather than trying to detect where each declaration "ends" via brace
 * depth or newline heuristics (fragile: multi-line unions, doc comments,
 * blank lines between `=` and the first `|` variant, etc. all break that
 * approach), we find every top-level `export ...` start in one pass and
 * simply say each declaration runs up to the start of the *next* one (or
 * EOF). This is robust because specta always emits declarations back to
 * back at column 0, regardless of what's inside them.
 */
function parseDeclarations(src) {
  const declRegex =
    /^export\s+(type|interface|enum|const|function|class)\s+([A-Za-z0-9_$]+)/gm;

  const matches = [];
  let match;
  while ((match = declRegex.exec(src)) !== null) {
    matches.push({ start: match.index, name: match[2] });
  }

  const decls = new Map(); // name -> full source text of the declaration
  const order = [];

  for (let idx = 0; idx < matches.length; idx++) {
    const { start, name } = matches[idx];
    const end = idx + 1 < matches.length ? matches[idx + 1].start : src.length;
    const text = src.slice(start, end).trim();
    decls.set(name, text);
    order.push(name);
  }

  return { decls, order };
}

const bindings = parseDeclarations(bindingsSrc);
const types = parseDeclarations(typesSrc);

const missing = types.order.filter((name) => !bindings.decls.has(name));

if (missing.length === 0) {
  console.log(
    "No extra types found in types.ts that aren't already in bindings.ts.",
  );
} else {
  console.log(`Merging ${missing.length} extra type(s) into bindings.ts:`);
  for (const name of missing) console.log(`  + ${name}`);
}

const appendedBlock = missing.map((name) => types.decls.get(name)).join("\n\n");

const merged =
  bindingsSrc.trimEnd() +
  (appendedBlock
    ? `\n\n// ---- merged from types.ts (specta::collect) ----\n\n${appendedBlock}\n`
    : "\n");

fs.writeFileSync(bindingsPath, merged, "utf8");
fs.unlinkSync(typesPath);

console.log(`\nWrote merged output to ${bindingsPath}`);
console.log(`Removed ${typesPath}`);
