#!/usr/bin/env node
// scripts/gen-bindings.mjs
//
// Post-processes tauri-specta output in one pass:
//   1. Appends types unique to types.ts (specta::collect) into bindings.ts
//      (Builder::export), then deletes types.ts.
//   2. Marks every property readonly.
//   3. Strips the `?` that `#[serde(default)]` produces — Rust always writes
//      every field, so the value is never actually absent. Keep a field
//      optional by listing it in KEEP_OPTIONAL.
//   4. Retypes hex-bearing `string` properties as HexColor.
//
// Usage: node scripts/gen-bindings.mjs [bindingsPath] [typesPath]

///FIXME: ai

import fs from "node:fs";
import path from "node:path";
import { Project, SyntaxKind } from "ts-morph";

const bindingsPath = path.resolve(process.argv[2] ?? "src/lib/bindings.ts");
const typesPath = path.resolve(process.argv[3] ?? "src/lib/types.ts");

/** Properties that are genuinely optional, as "TypeName.propName". */
const KEEP_OPTIONAL = new Set([]);

/** Types whose plain `string` members hold a hex color. */
const HEX_TYPES = new Set(["ColorVariable", "SplitColorVariable"]);

const norm = (s) => s.replace(/\s+/g, " ").trim();

// specta emits declarations back to back at column 0, so each one runs from
// its leading comment to the start of the next.
function parse(src) {
  const re = /^export\s+(?:type|interface|enum|const|function|class)\s+([A-Za-z0-9_$]+)/gm;
  const hits = [...src.matchAll(re)].map((m) => ({ name: m[1], at: m.index }));
  const decls = new Map();

  hits.forEach(({ name, at }, i) => {
    const lead = src.slice(0, at).match(/(?:[ \t]*(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)[ \t]*\n)+$/);
    const start = lead ? at - lead[0].length : at;
    decls.set(name, src.slice(start, hits[i + 1]?.at ?? src.length).trim());
  });

  return decls;
}

function merge() {
  const src = fs.readFileSync(bindingsPath, "utf8");
  if (!fs.existsSync(typesPath)) return src;

  const bindings = parse(src);
  const types = parse(fs.readFileSync(typesPath, "utf8"));

  const missing = [];
  for (const [name, text] of types) {
    const existing = bindings.get(name);
    if (!existing) missing.push(name);
    else if (norm(existing) !== norm(text)) {
      console.warn(`⚠ ${name} differs between the two files; keeping bindings.ts`);
    }
  }

  fs.unlinkSync(typesPath);
  console.log(missing.length ? `Merged: ${missing.join(", ")}` : "Nothing to merge");

  const block = missing.map((n) => types.get(n)).join("\n\n");
  return src.trimEnd() + (block ? `\n\n// ---- merged from types.ts ----\n\n${block}\n` : "\n");
}

function fix() {
  const source = new Project().addSourceFileAtPath(bindingsPath);
  let readonly = 0;
  let required = 0;
  let hex = 0;

  // covers interface members and object-literal type members in one pass
  for (const prop of source.getDescendantsOfKind(SyntaxKind.PropertySignature)) {
    if (!prop.isReadonly()) {
      prop.setIsReadonly(true);
      readonly++;
    }

    const owner =
      prop.getFirstAncestorByKind(SyntaxKind.InterfaceDeclaration)?.getName() ??
      prop.getFirstAncestorByKind(SyntaxKind.TypeAliasDeclaration)?.getName() ??
      "";

    if (prop.hasQuestionToken() && !KEEP_OPTIONAL.has(`${owner}.${prop.getName()}`)) {
      prop.setHasQuestionToken(false);
      required++;
    }

    // only plain `string` — the union arm holding SplitColorVariable is left alone
    if (HEX_TYPES.has(owner) && prop.getTypeNode()?.getText() === "string") {
      prop.setType("HexColor");
      hex++;
    }
  }

  for (const index of source.getDescendantsOfKind(SyntaxKind.IndexSignature)) {
    if (!index.isReadonly()) {
      index.setIsReadonly(true);
      readonly++;
    }
  }

  if (hex > 0 && !source.getTypeAlias("HexColor")) {
    source.insertStatements(0, "export type HexColor = `#${string}`;\n");
  }

  source.saveSync();
  console.log(
    `✔ ${readonly} readonly, ${required} de-optionalised, ${hex} hex — ${bindingsPath}`
  );
}

if (!fs.existsSync(bindingsPath)) {
  console.error(`not found: ${bindingsPath}`);
  process.exit(1);
}

fs.writeFileSync(bindingsPath, merge(), "utf8");
fix();