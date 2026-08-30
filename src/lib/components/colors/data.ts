import type { Accents, ColorVariable, Neutrals, Scheme, Settings, SystemColorVariables } from "$lib/bindings";
import { getActiveScheme, settings } from "$lib/logic/settings.svelte";
import type { MediaQuery } from "svelte/reactivity";

type HexColor = `#${string}`;
type RGB = {r: number, g: number, b: number};
export type HSV = {h: number, s: number, v: number}

export type ColorInput = HexColor | keyof Neutrals | keyof Accents

export function isHex(s: string): s is HexColor{
  return /^#[0-9a-f]{6}$/i.test(s);
}

export function isColorVariable(c: any): c is ColorVariable{
  if(typeof c !== "object" || c === "null") return false;
  const { type, value } = c as { type?: unknown; value?: unknown };
  if(type === "Single" && typeof value === "string") return isHex(c.value);
  if(type === "Split"){
    if (typeof value !== "object" || value === null) return false;
    const { light, dark } = value as { light?: unknown; dark?: unknown };
    if(typeof light !== "string" || typeof dark !== "string") return false;
    return isHex(c.value.light) && isHex(c.value.dark);
  } 
  return false;
}

export function colorError(value: any): HexColor{
  console.warn(`colorError: ${JSON.stringify(value)}`);
  //TODO: make this the "error" color variable
  return "#ff00ff"
}

export function hexToHsv(hex: HexColor): HSV {
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
    if (max === r)      h = ((g - b) / difference) % 6;
    else if (max === g) h = (b - r) / difference + 2;
    else                h = (r - g) / difference + 4;
    h = (h * 60 + 360) % 360;
  }
  let s = max === 0 
    ? 0 
    : difference / max
  let v = max;

  h = Math.round(h);
  s = Math.round(s*100)/100;
  v = Math.round(v*100)/100;

  return {h, s, v};
}

export function hsvToHex(c: HSV): HexColor {
  const {h, s, v} = c;
  const f = (offset: number): string => {
    const phase = (offset + h / 60) % 6;
    const channelValue = v - v * s * Math.max(0, Math.min(phase, 4 - phase, 1));
    return Math.round(channelValue * 255).toString(16).padStart(2, '0');
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}


export function hexToRgb(hex: HexColor): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

export function relativeLuminance(hex: HexColor): number {
  const {r,g,b} = hexToRgb(hex)
  const linearize = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(a: HexColor, b: HexColor): number {
  const lumA = relativeLuminance(a);
  const lumB = relativeLuminance(b);
  const high = Math.max(lumA, lumB);
  const low = Math.min(lumA, lumB);
  return (high + 0.05) / (low + 0.05);
}

export function resolveColorInput(c: ColorInput, schemeOverride?: boolean): HexColor{
  if(isHex(c)) return c;
  const colors = {...settings.theme.system_color_variables.neutrals, ...settings.theme.system_color_variables.accents}
  return resolveColorVariable(colors[c], schemeOverride)
}

export function resolveColorVariable(c: ColorVariable, schemeOverride?: boolean): HexColor{
  if(!isColorVariable(c)) return colorError(c);
  if(c.type === "Single") return c.value;
  if(schemeOverride !== undefined) return schemeOverride ? c.value.light : c.value.dark;
  return getActiveScheme() ? c.value.light : c.value.dark
}

export function getTextColorOn(background: HexColor, schemeOverride?: boolean): "var(--gray0)" | "var(--gray4)" | "var(--light-gray0)" | "var(--light-gray4)" | "var(--dark-gray0)" | "var(--dark-gray4)"{
  const gray0 = resolveColorVariable(settings.theme.system_color_variables.neutrals.gray0, schemeOverride);
  const gray4 = resolveColorVariable(settings.theme.system_color_variables.neutrals.gray4, schemeOverride);
  const lightText = contrastRatio(background, gray0) > contrastRatio(background, gray4)
  if(schemeOverride === undefined) return lightText ? "var(--gray0)" : "var(--gray4)";
  if(schemeOverride) return lightText ? "var(--light-gray0)" : "var(--light-gray4)";
  return lightText ? "var(--dark-gray0)" : "var(--dark-gray4)";
}

export function applyBackgroundColor(background: ColorInput, schemeOverride?: boolean): string{
  const backgroundHex = resolveColorInput(background, schemeOverride)
  const textColor = getTextColorOn(backgroundHex, schemeOverride)
  return `background-color: ${backgroundHex}; color: ${textColor}`
}