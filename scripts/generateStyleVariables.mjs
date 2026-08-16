import fs from "fs";
import path from "path";

const themePath = path.resolve("./src/lib/styling/systemTheme.json");
const theme = JSON.parse(fs.readFileSync(themePath, "utf-8"));

const colorBlocks = { light: "", dark: "" };
let rootVars = "";

for (const [sectionKey, section] of Object.entries(theme)) {
  if (sectionKey === "colors") {
    for (const [scheme, tokens] of Object.entries(section)) {
      for (const [key, value] of Object.entries(tokens)) {
        colorBlocks[scheme] += `    --${key}: ${value};\n`;
      }
    }
    continue;
  }

  for (const [key, value] of Object.entries(section)) {
    rootVars += `  --${key}: ${value};\n`;
  }
}

const banner = "/* Generated from systemTheme.json — do not edit. */";

const cssOutput = `${banner}

:root {
${rootVars}}

@media (prefers-color-scheme: light) {
  :root {
${colorBlocks.light}  }
}

@media (prefers-color-scheme: dark) {
  :root {
${colorBlocks.dark}  }
}
`;

const tsOutput = `${banner}
export const systemTheme = ${JSON.stringify(theme, null, 2)};
`;

const cssOutputFile = path.resolve("./src/lib/styling/systemTheme.css");
const tsOutputFile = path.resolve("./src/lib/styling/systemTheme.ts");

fs.mkdirSync(path.dirname(cssOutputFile), { recursive: true });
fs.writeFileSync(cssOutputFile, cssOutput);
fs.writeFileSync(tsOutputFile, tsOutput);