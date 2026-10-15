import type { ColorVariable, HexColor } from "$lib/bindings";


export function isHex(s: string): s is HexColor {
  return /^#[0-9a-f]{6}$/i.test(s);
}export function isColorVariable(c: any): c is ColorVariable {
  if (typeof c !== "object" || c === "null") return false;
  const { type, value } = c as { type?: unknown; value?: unknown; };
  if (type === "Single" && typeof value === "string") return isHex(c.value);
  if (type === "Split") {
    if (typeof value !== "object" || value === null) return false;
    const { light, dark } = value as { light?: unknown; dark?: unknown; };
    if (typeof light !== "string" || typeof dark !== "string") return false;
    return isHex(c.value.light) && isHex(c.value.dark);
  }
  return false;
}

