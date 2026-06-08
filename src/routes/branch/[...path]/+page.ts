export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { LoadedBranch } from "./_types/LoadedBranch";
import { loadBranch, loadDir } from "./_logic/loading";
import { saveManager } from "./_logic/saving.svelte";

//TODO: make children lazy load as they become visible to improve FCP time
export const load: PageLoad<{
  branchLoadData: LoadedBranch
  childLoadData: Record<string, LoadedBranch>
}> = async ({params}) => {
  saveManager.reload();
  const branchLoadData = await loadBranch(params.path).catch(async (err1)=>{
    if(params.path == "Home"){
      await invoke('create_home_branch')
      return loadBranch(params.path).catch((err2)=>{
        if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
        else throw err2;
      })
    }
    else{ throw err1 }
  })
  const childLoadData = await loadDir(params.path, branchLoadData.color);
  return {branchLoadData, childLoadData}
};

