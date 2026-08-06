import { commands } from "$lib/bindings";
import { joinPath } from "$lib/logic/filesystem";
import { ask } from "@tauri-apps/plugin-dialog";
import type { IdPath } from "../utils";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

export async function newChild(parentPath?: IdPath) {
  const parent = stateManager.nodeHandle(parentPath)

  const childResult = await commands.createBranch(joinPath(parent.branch.path, "New Branch"));
  if (childResult.status === "error") throw new Error(childResult.error);
  const child = childResult.data;

  parent.applyCommand((p)=>{
    p.children = {
      ...p.children, 
      [child.id]: {
        branch: { 
          ...child, 
          type: "LoadedBranch" 
        }, 
        children: {} 
      } 
    }
  });
}

export async function deleteChild(childPath: IdPath){
  if(childPath.length === 0) throw new Error("Cannot delete the root branch.");
  const child = stateManager.nodeHandle(childPath);

  //TODO: make this send the branch to a trash folder rather than outright deleting it.
  const deleteConfirmed = await ask(`Are you sure you want to delete "${child.branch.filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(!deleteConfirmed) return

  const parentPath = childPath.slice(0,-1);
  const parent = stateManager.nodeHandle(parentPath);

  const deleteResult = await commands.deleteFile(child.branch.path);
  if(deleteResult.status == "error") throw new Error(deleteResult.error);

  parent.applyCommand(async (p)=>{delete p.children![child.branch.id]})  
}
