import type { LoadedBranch } from "../../../../../lib/types/rustTypes/LoadedBranch";
import { ask } from "@tauri-apps/plugin-dialog";
import { createBranch } from "../../_data/branch";
import { appendChildFiledata, childFiledata, removeChildFiledata } from "../../_logic/filedata.svelte";
import { stateManager } from "../../_logic/operations.svelte";
import { saveManager } from "../../_logic/saving.svelte";
import { invoke } from "@tauri-apps/api/core";

export async function newBranch(path: string){
  const lb = await createBranch(path);
  stateManager.pushOperation({
    redo: ()=>{
      appendChildFiledata(lb);
      saveManager.addEditedChild(lb.branch.id);
    },
    undo: ()=>{
      removeChildFiledata(lb);
      saveManager.removeEditedChild(lb.branch.id);
    }
  })
}
export async function deleteBranch(lb: LoadedBranch){
  //TODO: make this send the branch to a trash folder rather than outright deleting it.
  stateManager.pushOperation({
    redo: async ()=>{
      const deleteConfirmed = await ask(`Are you sure you want to delete "${lb.filename}"?`, {
        title: "Aspenel",
        kind: "warning"
      })
      if(deleteConfirmed){
        invoke('delete_file', {path: lb.path});
        removeChildFiledata(lb);
        saveManager.removeEditedChild(lb.branch.id);
      }
    },
    undo: ()=>{
      //TODO
    }
  })
  
}