import type { Accents, ColorValue, SystemColor } from "$lib/bindings";
import { settings } from "$lib/logic/settings.svelte";
import { colorGroups } from "$lib/styling/systemTheme";

export type HexColorValue = ColorValue & {type: "HexColor"};

export function colorError(value: any, message?: string): HexColorValue {
  console.warn(`colorError: ${JSON.stringify(value)}${message ? (", " + message) : ""}`);
  return {type: "HexColor", value: "#ff00ff"};
}

type SystemColorMap = {
  [K in SystemColor]: { type: "SystemColor"; value: K; };
};

export const systemColors = Object.fromEntries(
  Object.values(colorGroups)
    .flat()
    .map((colorName) => ([colorName, { type: "SystemColor", value: colorName }]))
) as SystemColorMap;

export function getRandomColor(index?: number): ColorValue {
  const colors = Object.keys(settings.theme.system_color_variables.accents) as (keyof Accents)[];
  const color = colors[(index ?? Math.floor(Math.random() * colors.length)) % colors.length]!;
  return { type: "SystemColor", value: color };
}

