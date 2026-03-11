export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { LoadedDocument } from "$lib/types/fileHandling/DocumentLoadResult";
import { loadDocument } from "$lib/filesystem/utils";

export const load: PageLoad<LoadedDocument> = async ({params}) => {
  return loadDocument(params.path).catch(async (err1)=>{
    await invoke('create_home_branch')
    return loadDocument(params.path).catch((err2)=>{
      if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
      else throw err2;
    })
  })
};