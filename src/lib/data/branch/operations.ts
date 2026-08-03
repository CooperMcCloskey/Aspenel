import { commands } from "$lib/bindings";
import { joinPath } from "$lib/logic/filesystem";
import { stateManager } from "$lib/logic/state.svelte";
import { ask } from "@tauri-apps/plugin-dialog";
import { getNode } from "./data";
import type { IdPath, ParentStateTreeVariant } from "./types";

export async function newChild(parentPath?: IdPath) {
  const parent = stateManager.getNode(parentPath);

  const childResult = await commands.createBranch(joinPath(parent.branch.path, "New Branch"));
  if (childResult.status === "error") throw new Error(childResult.error);
  const child = childResult.data;

  stateManager.applyOperationRecipe((draft) => {
    const parent = getNode<true>(draft, parentPath);
    parent.children = { ...parent.children, [child.id]: { branch: { ...child, type: "LoadedBranch" }, children: {} } };
  });
}

export async function deleteChild(childPath: IdPath){
  const child = stateManager.getNode(childPath).branch
  //TODO: make this send the branch to a trash folder rather than outright deleting it.
  const deleteConfirmed = await ask(`Are you sure you want to delete "${child.filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(!deleteConfirmed) return

  stateManager.applyOperationRecipe((draft)=>{
    const deleteResult = commands.deleteFile(child.path); //TODO: side effect in the operation. Not sure how to deal with it
    deleteResult.then((result)=>{if(result.status === "error") throw new Error(result.error)})

    const parentPath = childPath.slice(0,-1);
    const parent = getNode(draft, parentPath) as ParentStateTreeVariant //Cast to make children a required field
    delete parent.children[child.id];
  })
}
