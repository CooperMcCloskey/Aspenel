import type { ColorVariable, ResolvedSettingsData, SettingsData, SystemColorVariables, Theme, ThemeOption } from "$lib/bindings";
import { systemTheme } from "$lib/styling/systemTheme";
import { objectEntries, objectFromEntries } from "$lib/types/utils";
import type { WritableDeep } from "type-fest";

export function resolveSettings(settings: SettingsData): ResolvedSettingsData{
  return {
    ...settings,
    theme: resolveTheme(settings.theme),
  }
}

function resolveTheme(theme: ThemeOption): Theme{
  if(theme !== "default") return theme;
  return{
    system_color_variables: defaultColors()
  }
}

function defaultColors(): SystemColorVariables{
  const {light: lightColors, dark: darkColors} = systemTheme.colors;
  
  return objectFromEntries(
    objectEntries(lightColors).map<[keyof SystemColorVariables, ColorVariable]>(
      ([key, lightColor])=>{
        const darkColor = darkColors[key]
        return lightColor == darkColor
          ? [key, lightColor]
          : [key, {light: lightColor, dark: darkColor}]
      }
    )
  )
}