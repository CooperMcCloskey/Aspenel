export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { LayoutLoad } from "../$types";
import type { Filedata } from "$lib/types/rustTypes/Filedata";

export const load: LayoutLoad = async ({params}) => {
  if(params.path == undefined) throw "File path unset"
  let filedata: Filedata = await invoke('read_file', {path: `${params.path}/meta.json`});
  return {
    filedata: filedata,
  }
};