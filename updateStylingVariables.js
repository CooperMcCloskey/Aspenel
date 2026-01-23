import fs from "fs";
import path from "path";

const themePath = path.resolve("./src/lib/styling/theme.json");
const theme = JSON.parse(fs.readFileSync(themePath, "utf-8"));

let themeColors = {
  "light": "",
  "dark": ""
}
let css = "";
let ts = ""

for (const [sectionKey, section] of Object.entries(theme)) {
  ts+= "\n"

  if (sectionKey === "colors") {
    for (const [scheme, colors] of Object.entries(section)) {
      ts += `  ${scheme}: {\n`
      for (const [key, value] of Object.entries(colors)) {
        themeColors[scheme] += `    --${key}: ${value};\n`;
        ts +=`    ${key}: ${/^-?\d*\.?\d+[a-z%]+$/i.test(value) ? value.replace(/(-?\d*\.?\d+)([a-z%]+)/i, '$1') : `"${value}"`},\n`;
      }
      ts += "  },\n"
    }
    
    continue
  }

  css += "\n";
  for (const [key, value] of Object.entries(section)) {
    css += `  --${key}: ${value};\n`;
    ts += `  ${key}: ${/^-?\d*\.?\d+[a-z%]+$/i.test(value) ? value.replace(/(-?\d*\.?\d+)([a-z%]+)/i, '$1') : `"${value}"`},\n`;
  }
}

const cssOutput = `/* npm run updateStylingVariables to update */

:root {
${css}
}

@media (prefers-color-scheme: light) {
  :root {
${themeColors.light}
  }
}
  
@media (prefers-color-scheme: dark) {
  :root {
${themeColors.dark}
  }
}
`
const cssOutputFile = path.resolve("./src/lib/styling/variables.css");
const tsOutput = `${`// npm run updateStylingVariables to update\n\nexport const stylingVars = {${ts}}`}`
const tsOutputFile = path.resolve("./src/lib/styling/variables.ts");

fs.mkdirSync(path.dirname(cssOutputFile), { recursive: true });
fs.mkdirSync(path.dirname(tsOutputFile), { recursive: true });
fs.writeFileSync(cssOutputFile, cssOutput);
fs.writeFileSync(tsOutputFile, tsOutput);

console.log(`css created at ${cssOutputFile}`);
console.log(`ts created at ${tsOutputFile}`);