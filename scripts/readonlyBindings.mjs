// scripts/make-readonly.mjs
//
// Post-processes a tauri-specta generated bindings.ts file so every
// property on every generated `interface` and object-literal `type`
// becomes `readonly`.
//
// Usage:
//   npm install -D ts-morph
//   node scripts/make-readonly.mjs
//
// Run this AFTER tauri-specta's `export()` call, e.g. as a follow-up
// step in your build script / npm script:
//   "gen:bindings": "cargo run --bin export-bindings && node scripts/make-readonly.mjs"

import { Project, SyntaxKind } from "ts-morph";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 👇 Set this to wherever tauri-specta writes your bindings file.
// Relative paths are resolved from this script's own location.
const BINDINGS_PATH = "../src/lib/bindings.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, BINDINGS_PATH);

const project = new Project();
const sourceFile = project.addSourceFileAtPath(filePath);

let changed = 0;

// 1. `interface Foo { field: string }` -> `interface Foo { readonly field: string }`
for (const iface of sourceFile.getInterfaces()) {
  for (const prop of iface.getProperties()) {
    if (!prop.isReadonly()) {
      prop.setIsReadonly(true);
      changed++;
    }
  }
}

// 2. `type Foo = { field: string }` (and nested object literals inside
//    unions/intersections/generics) -> add readonly to every property
//    signature found in a type-literal node.
sourceFile
  .getDescendantsOfKind(SyntaxKind.TypeLiteral)
  .forEach((typeLiteral) => {
    typeLiteral.getMembers().forEach((member) => {
      if (member.getKind() === SyntaxKind.PropertySignature) {
        if (!member.isReadonly()) {
          member.setIsReadonly(true);
          changed++;
        }
      }
    });
  });

await sourceFile.save();

console.log(`✔ Marked ${changed} propert${changed === 1 ? "y" : "ies"} as readonly in ${filePath}`);
