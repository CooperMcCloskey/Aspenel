export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
import { loadBranch } from "$lib/filesystem/loading";

export const load: PageLoad<LoadedBranch> = async ({params}) => {
  return loadBranch(params.path).catch(async (err1)=>{
    await invoke('create_home_branch')
    return loadBranch(params.path).catch((err2)=>{
      if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
      else throw err2;
    })
  })
};