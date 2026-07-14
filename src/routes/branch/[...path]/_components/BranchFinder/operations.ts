import type { LoadedBranch } from "../../../../../lib/types/bindings/LoadedBranch";
import { ask } from "@tauri-apps/plugin-dialog";;
import { stateManager } from "../../../../../lib/logic/state.svelte";
import { invoke } from "@tauri-apps/api/core";
import { createBranch, getNode } from "$lib/data/branch/data";
import type { Mutable } from "$lib/types/utils";
import type { IdPath, LoadedBranchNode } from "$lib/data/branch/types";
import type { Id } from "$lib/types/bindings/Id";

export async function newChild(parentPath?: IdPath){
  const parent = stateManager.getNode(parentPath);
  const child = await createBranch(parent.node.path) as Mutable<LoadedBranch>;
  stateManager.applyOperationRecipe((draft)=>{
    const parent = getNode(draft, parentPath);
    parent.children = {...parent.children, [child.filedata.id]: {node: child, children: {}}}
  });
}

export async function deleteChild(childPath: IdPath){
  const child = stateManager.getNode(childPath).node
  //TODO: make this send the branch to a trash folder rather than outright deleting it.
  const deleteConfirmed = await ask(`Are you sure you want to delete "${child.filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(!deleteConfirmed) return

  stateManager.applyOperationRecipe((draft)=>{
    invoke('delete_file', {path: child.path}); //TODO: side effect in the operation. Not sure how to deal with it
    const parentPath = childPath.slice(0,-1);
    const parent = getNode(draft, parentPath) as {node: LoadedBranch, children: Record<Id, LoadedBranchNode>}
    delete parent.children[child.filedata.id];
  })
}