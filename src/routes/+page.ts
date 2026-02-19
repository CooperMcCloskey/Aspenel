export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { FsDocument } from "$lib/types/rustTypes/FsDocument";
import type { PageLoad } from "./$types";
import type { DocumentLoad } from "$lib/types/fileHandling/DocumentLoadResult";
import { loadDocument } from "$lib/filesystem/utils";

export const load: PageLoad<DocumentLoad> = async ({params}) => {
  const path = "Home"
  
  return loadDocument(path).catch(async (err1)=>{
    await invoke('create_home_branch')
    return loadDocument(path).catch((err2)=>{
      if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
      else throw err2;
    })
  })
};