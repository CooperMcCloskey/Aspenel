import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dir = "src/lib/types/bindings";

for (const file of readdirSync(dir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;

  const path = join(dir, file);
  let src = readFileSync(path, "utf-8");

  // match ts-rs's typical output: `export interface Foo { ... }` or `export type Foo = ...;`
  const interfaceMatch = src.match(/export interface (\w+)/);
  const typeMatch = src.match(/export type (\w+) =/);

  const name = interfaceMatch?.[1] ?? typeMatch?.[1];
  if (!name) continue; // nothing to wrap (e.g. file with only re-exports)

  const shapeName = `${name}Shape`;

  // rename the declaration itself: `export interface Foo` -> `interface FooShape`
  // and `export type Foo =` -> `type FooShape =`
  src = src
    .replace(`export interface ${name}`, `interface ${shapeName}`)
    .replace(`export type ${name} =`, `type ${shapeName} =`);

  // add Immer import if not already present
  if (!src.includes('from "immer"')) {
    src = `import type { Immutable } from "immer";\n${src}`;
  }

  // re-export the original name as the wrapped, deeply-readonly version
  src += `\nexport type ${name} = Immutable<${shapeName}>;\n`;

  writeFileSync(path, src);
}

console.log("Bindings wrapped in Immutable<T>.");