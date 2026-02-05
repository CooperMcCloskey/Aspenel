export const ssr = false;
import type { FileData } from "$lib/types/rustTypes";
import { invoke } from "@tauri-apps/api/core";
import type { LayoutLoad } from "../$types";

export const load: LayoutLoad = async ({params}) => {
  if(params.path == undefined) throw "File path unset"
  let fileData: FileData = await invoke('read_file', {path: `${params.path}/meta.json`});
  return {
    fileData,
  }
};