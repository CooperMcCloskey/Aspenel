export const ssr = false;
import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { LoadedBranch } from "./_types/LoadedBranch";
import { loadBranch, loadDir } from "./_logic/loading";

//TODO: make children lazy load as they become visible to improve FCP time
export const load: PageLoad<{
  branchData: LoadedBranch
  childData: Record<string, LoadedBranch>
}> = async ({params}) => {
  const branchData = await loadBranch(params.path).catch(async (err1)=>{
    await invoke('create_home_branch')
    return loadBranch(params.path).catch((err2)=>{
      if(err1 instanceof Error && err2 instanceof Error) throw new Error(err1.message + "; " + err2.message)
      else throw err2;
    })
  })
  const childData = await loadDir(params.path, branchData.color);
  return {branchData, childData}
};

