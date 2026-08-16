import { commands, type SettingsData } from "$lib/bindings";
import { resolveSettings } from "$lib/data/settings/data";
import type { PageLoad } from "./$types";

export const load: PageLoad<SettingsData> = async ()=>{
  const settingsResult = await commands.readSettings()
  if(settingsResult.status === "ok") return resolveSettings(settingsResult.data);
  else throw new Error(settingsResult.error);
}