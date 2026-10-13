import type { Settings } from "$lib/bindings";
import { getTextColorOn, resolveColorInput, resolveColorVariable } from "$lib/components/colors/data";
import { MediaQuery } from "svelte/reactivity";

export const settings: Settings = $state({}) as Settings
export function setSettings(s: Settings){ Object.assign(settings,s) }

const systemScheme = new MediaQuery("prefers-color-scheme: light");

export function getActiveScheme(): boolean{
  const selectedScheme = settings.selected_scheme;
  if(selectedScheme === "Light") return true;
  if(selectedScheme === "Dark") return false;
  return systemScheme.current ? true : false;
}

export function applySettingsChanges(settings: Settings){
  if (!settings.theme) return;

  const scheme = getActiveScheme();
  const root = document.documentElement;

  for (const group of Object.values(settings.theme.system_color_variables)) {
    for (const [key, cv] of Object.entries(group)) {
      const hex = resolveColorVariable(cv, scheme);

      root.style.setProperty(`--${key}`, hex);
      root.style.setProperty(`--light-${key}`, resolveColorVariable(cv, true));
      root.style.setProperty(`--dark-${key}`, resolveColorVariable(cv, false));
    }
  }
  root.style.setProperty("color", getTextColorOn(resolveColorInput({type: "SystemColor", value: "background"})))
}