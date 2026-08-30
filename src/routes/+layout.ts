import { commands } from "$lib/bindings";
import { setSettings } from "$lib/logic/settings.svelte";
import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load: LayoutLoad = async ()=>{
  const settingsResult = await commands.readSettings();
  if(settingsResult.status === "ok") setSettings(settingsResult.data);
  else throw settingsResult.error;
}