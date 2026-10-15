import type { Scheme, Settings } from "$lib/bindings";
import { getTextColorOn } from "$lib/data/colors/contrast";
import { resolveColorVariable } from "$lib/data/colors/conversion";
import { toHex } from "$lib/data/colors/conversion";
import { MediaQuery } from "svelte/reactivity";

export const settings: Settings = $state({}) as Settings
export function setSettings(s: Settings){ Object.assign(settings,s) }

const systemScheme = new MediaQuery("prefers-color-scheme: light");

export function getActiveScheme(): Scheme {
  const selectedScheme = settings.selected_scheme;
  if(selectedScheme !== "system") return selectedScheme;
  return systemScheme.current ? "light" : "dark";
}

export function applySettingsChanges(settings: Settings){
  if (!settings.theme) return;

  const scheme = getActiveScheme();
  const root = document.documentElement;

  for (const group of Object.values(settings.theme.system_color_variables)) {
    for (const [key, cv] of Object.entries(group)) {
      const hex = resolveColorVariable(cv, scheme);

      root.style.setProperty(`--${key}`, hex);
      root.style.setProperty(`--light-${key}`, resolveColorVariable(cv, "light"));
      root.style.setProperty(`--dark-${key}`, resolveColorVariable(cv, "dark"));
    }
  }
  root.style.setProperty("color", getTextColorOn({type: "SystemColor", value: "background"}))
}