#!/usr/bin/env node
// scripts/gen-theme.mjs
//
// Generates systemTheme.css and systemTheme.ts from systemTheme.json.
//
// A color is either a hex string (shared across schemes) or { light, dark }.
// CSS variable names are flat — the group is organisation, not part of the name.

//FIXME: ai

import fs from "node:fs";
import path from "node:path";

const themePath = path.resolve("./src/lib/styling/systemTheme.json");
const cssOutputFile = path.resolve("./src/lib/styling/systemTheme.css");
const tsOutputFile = path.resolve("./src/lib/styling/systemTheme.ts");

const HEX = /^#[0-9a-f]{6}$/i;
const SCHEMES = ["light", "dark"];

const { colors, ...sections } = JSON.parse(fs.readFileSync(themePath, "utf-8"));

// ---- validate, and normalise case so nothing ever differs by capitalisation
const colorGroups = {};
const seen = new Set();

for (const [group, entries] of Object.entries(colors)) {
  if (entries === null || typeof entries !== "object") {
    throw new Error(`colors.${group} must be an object of colors`);
  }

  colorGroups[group] = Object.keys(entries);

  for (const [key, value] of Object.entries(entries)) {
    if (seen.has(key)) {
      throw new Error(`duplicate color key "${key}" in group "${group}" — CSS variables are flat`);
    }
    seen.add(key);

    if (typeof value === "string") {
      if (!HEX.test(value)) {
        throw new Error(`colors.${group}.${key} is "${value}", expected #rrggbb`);
      }
      entries[key] = value.toLowerCase();
      continue;
    }

    const schemes = Object.keys(value ?? {});
    if (schemes.length !== SCHEMES.length || !SCHEMES.every((s) => schemes.includes(s))) {
      throw new Error(`colors.${group}.${key} must be a hex string or { light, dark }`);
    }

    for (const scheme of SCHEMES) {
      if (!HEX.test(value[scheme])) {
        throw new Error(`colors.${group}.${key}.${scheme} is "${value[scheme]}", expected #rrggbb`);
      }
      value[scheme] = value[scheme].toLowerCase();
    }
  }
}

// ---- emit
const resolve = (value, scheme) => (typeof value === "string" ? value : value[scheme]);

const allColors = () => Object.values(colors).flatMap((group) => Object.entries(group));

const vars = (scheme, { indent = "  ", prefix = "" } = {}) =>
  allColors()
    .map(([key, value]) => `${indent}--${prefix}${key}: ${resolve(value, scheme)};\n`)
    .join("");

const rootVars = Object.values(sections)
  .flatMap((section) => Object.entries(section))
  .map(([key, value]) => `  --${key}: ${value};\n`)
  .join("");

const banner = "/* Generated from systemTheme.json — do not edit. */";

const cssOutput = `${banner}

:root {
${rootVars}
  /* both schemes, always resolvable regardless of the active one */
${vars("light", { prefix: "light" })}
${vars("dark", { prefix: "dark" })}}

@media (prefers-color-scheme: light) {
  :root {
${vars("light", { indent: "    " })}  }
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${vars("dark", { indent: "    " })}  }
}

:root[data-theme="light"] {
  color-scheme: light;
${vars("light")}}

:root[data-theme="dark"] {
  color-scheme: dark;
${vars("dark")}}
`;

const tsOutput = `${banner}
export const systemTheme = ${JSON.stringify({ colors, ...sections }, null, 2)} as const;

/** Color keys by group, in file order. */
export const colorGroups = ${JSON.stringify(colorGroups, null, 2)} as const;

export type ColorGroup = keyof typeof colorGroups;
export type ColorKey = (typeof colorGroups)[ColorGroup][number];
export type Scheme = "light" | "dark";
`;

fs.mkdirSync(path.dirname(cssOutputFile), { recursive: true });
fs.writeFileSync(cssOutputFile, cssOutput);
fs.writeFileSync(tsOutputFile, tsOutput);

const count = seen.size;
const groups = Object.keys(colorGroups).length;
console.log(`✔ ${count} colors in ${groups} groups → systemTheme.css, systemTheme.ts`);