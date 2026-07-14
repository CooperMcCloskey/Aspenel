export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import { loadBranch } from "$lib/logic/filesystem";
import type { LoadedBranchNode } from "$lib/data/branch/types";
import { stateManager } from "$lib/logic/state.svelte";

export const load: PageLoad<LoadedBranchNode> = async ({params}) => {
  const branch = await loadBranch(params.path).catch(async (err1)=>{
    if(params.path == "Home"){
      await invoke('create_home_branch')
      return loadBranch(params.path).catch((err2)=>{
        if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
        else throw err2;
      })
    }
    else{ throw err1 }
  })
  return {node: branch}
};

