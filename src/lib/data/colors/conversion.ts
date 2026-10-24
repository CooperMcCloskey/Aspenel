import type { ColorValue, HexColor, ColorVariable, HSV, Scheme, SystemColor } from "$lib/bindings";
import { getActiveScheme, settings } from "$lib/logic/settings.svelte";
import { type RGB } from "./contrast";
import { colorError, type HexColorValue } from "./utils";
import { isColorVariable } from "./validation";

export function toHex(c: ColorValue, schemeOverride?: "light" | "dark"): HexColorValue {
  if (c.type === "HexColor") return c;
  else if (c.type == "HSV") {
    const { h, s, v } = c.value;
    const f = (offset: number): string => {
      const phase = (offset + h / 60) % 6;
      const channelValue = v - v * s * Math.max(0, Math.min(phase, 4 - phase, 1));
      return Math.round(channelValue * 255).toString(16).padStart(2, '0');
    };
    return {type: "HexColor", value: `#${f(5)}${f(3)}${f(1)}`};
  }
  else if (c.type === "AddedColorId") {
    const cv = settings.added_color_variables[c.value];
    if (cv) return resolveColorVariable(cv, schemeOverride);
    else return colorError(c, "added color id not found.");
  }
  else /* c.type === "SystemColor" */ {
    const { neutrals, accents } = settings.theme.system_color_variables;
    const cv: ColorVariable | undefined = { ...neutrals, ...accents }[c.value];
    if (cv) return resolveColorVariable(cv, schemeOverride);
    else return colorError(c);
  }
}
export function toHSV(color: ColorValue): HSV {
  if (color.type === "HSV") return color.value;
  const hex = toHex(color).value;
  const clean = hex.replace(/^#/, '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean; //for 3 letter hex codes
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const difference = max - min;

  let h = 0;
  if (difference !== 0) {
    if (max === r) h = ((g - b) / difference) % 6;
    else if (max === g) h = (b - r) / difference + 2;
    else h = (r - g) / difference + 4;
    h = (h * 60 + 360) % 360;
  }
  let s = max === 0
    ? 0
    : difference / max;
  let v = max;

  h = Math.round(h);
  s = Math.round(s * 100) / 100;
  v = Math.round(v * 100) / 100;

  return { h, s, v };
}
export function getRBG(color: ColorValue): RGB {
  const hex = toHex(color).value;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

export function resolveColorVariable(c: ColorVariable, schemeOverride?: Scheme): HexColorValue{
  if (!isColorVariable(c)) return colorError(c);
  if (c.type === "Single") return {type: "HexColor", value: c.value};
  if (schemeOverride !== undefined) return {type: "HexColor", value: schemeOverride === "light" ? c.value.light : c.value.dark};
  return {type: "HexColor", value: getActiveScheme() === "light" ? c.value.light : c.value.dark};
}
export function resolveSystemColor(color: SystemColor, schemeOverride?: Scheme): ColorValue {
  return toHex({type: "SystemColor", value: color}, schemeOverride);
}

