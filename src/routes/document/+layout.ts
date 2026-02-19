import { invoke } from "@tauri-apps/api/core";
import type { LayoutLoad } from "../$types";
import type { FsDocument } from "$lib/types/rustTypes/FsDocument";

export const load: LayoutLoad = async ({params}) => {
  const path = params.path;
  if(path == undefined) throw "File path unset"
  const [fsDocument, color] = await Promise.all([
    invoke<FsDocument>('read_document', {path}),
    invoke<string>('get_color', {path})
  ])
  return {
    fsDocument,
    color,
  }
};