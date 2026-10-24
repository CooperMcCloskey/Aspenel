import type { ColorValue, HexColor, Scheme } from "$lib/bindings";
import type { Attachment } from "svelte/attachments";
import { toHex, getRBG } from "./conversion";
import { resolveSystemColor } from "./conversion";
import { systemColors } from "./utils";

export type RGB = {r: number, g: number, b: number};
export type HSV = {h: number, s: number, v: number}

export function relativeLuminance(color: ColorValue): number {
  const {r,g,b} = getRBG(color);
  const linearize = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(a: ColorValue, b: ColorValue): number {
  const lumA = relativeLuminance(a);
  const lumB = relativeLuminance(b);
  const high = Math.max(lumA, lumB);
  const low = Math.min(lumA, lumB);
  return (high + 0.05) / (low + 0.05);
}

export function getTextColorOn(background: ColorValue, schemeOverride?: Scheme): "var(--gray0)" | "var(--gray4)" | "var(--light-gray0)" | "var(--light-gray4)" | "var(--dark-gray0)" | "var(--dark-gray4)"{
  const gray0: ColorValue = resolveSystemColor("gray0", schemeOverride)
  const gray4: ColorValue = resolveSystemColor("gray4", schemeOverride)
  const lightText = contrastRatio(background, gray0) + 1 > contrastRatio(background, gray4)
  if(schemeOverride === undefined) return lightText ? "var(--gray0)" : "var(--gray4)";
  else if(schemeOverride === "light") return lightText ? "var(--light-gray0)" : "var(--light-gray4)";
  else /*schemeOverride === "dark"*/ return lightText ? "var(--dark-gray0)" : "var(--dark-gray4)";
}

export function applyBackgroundColor(background: ColorValue | undefined, schemeOverride?: Scheme): string{
  if(!background) return "";
  const backgroundHex = toHex(background, schemeOverride).value
  const textColor = getTextColorOn(background, schemeOverride)
  return `
    --background-color: ${backgroundHex};
    background-color: ${backgroundHex}; 
    color: ${textColor}; 
  `;
}

function getBackgroundColor(e: HTMLElement): ColorValue{ 
  return ({
    type: "HexColor",
    value: getComputedStyle(e).getPropertyValue("--background-color") as HexColor 
  })
}

export function applyErrorText(invalid: boolean): Attachment<HTMLElement> {
  return (e) => {
    if(!invalid) return;
    const backgroundCR = contrastRatio(getBackgroundColor(e), systemColors.red);
    const blackCR = contrastRatio(systemColors.gray4, systemColors.red)
    const whiteCR = contrastRatio(systemColors.gray0, systemColors.red);

    const previous = e.style.getPropertyValue("background-color");
    const previousPriority = e.style.getPropertyPriority("background-color");
    console.log("----")
    console.log(`backgroundCR: ${backgroundCR}`)
    console.log(`blackCR: ${blackCR}`)
    console.log(`whiteCR: ${whiteCR}`)

    if(backgroundCR >= 3.5 || (backgroundCR + 1 >= blackCR && backgroundCR >= whiteCR)) return;
    e.style.setProperty("background-color", `var(--${blackCR >= whiteCR ? "gray4" : "gray0"})`, "important")
    e.style.color = `var(--red) !important`;

    return () => e.style.setProperty("background-color", previous, previousPriority);
  }
}
