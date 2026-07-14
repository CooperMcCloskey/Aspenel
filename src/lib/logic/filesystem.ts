
import { getNode } from "$lib/data/branch/data";
import type { IdPath, LoadedBranchNode } from "$lib/data/branch/types";
import type { Id } from "$lib/types/bindings/Id";
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch";
import { invoke } from "@tauri-apps/api/core";
import type { SaveState } from "./state.svelte";
import type { Immutable } from "immer";

export function joinPath(base: string, part: string): Promise<string> {
  return invoke<string>("join_path", {base, part}); //TODO: check if this can run without an aysnc invoke call
}

export async function separatePath(path: string): Promise<{separator: string, pathComponents: {single: string, cumulative: string}[]}>{
  const separator = await invoke<string>("get_path_separator");
  const singlePathComponents: string[] = await invoke("get_path_components", {path}); //TODO: check if this could be done without a rust command
  const pathComponents = singlePathComponents.map((single, i) => ({single, cumulative: singlePathComponents.slice(0, i+1).join(separator)}));

  return {separator, pathComponents}
}

export function branchHref(path: string){
  return path == "" ? "/branch/Home" : `/branch/${path}`;
}

export async function loadBranch(path: string): Promise<LoadedBranch> {
  return invoke<LoadedBranch>('load_branch', { path }); //TODO: optimize to reduce the number of branch reads
}

export async function loadDir(path: string, color: string): Promise<Record<Id, LoadedBranchNode>> {
  const children = await invoke<LoadedBranch[]>('load_dir', { path });
  const entries = children.map(c => [c.filedata.id, {node: c, children: {}}]);
  return Object.fromEntries(entries);
}

export async function saveTree(tree: LoadedBranchNode, editedBranchPaths: Immutable<IdPath[]>, rootPath: string): Promise<SaveState>{
  let savePromise = Promise.all(
    [...editedBranchPaths].map((path)=>{
      const branch = getNode(tree, path).node
      return invoke<void>("save_branch", {branch: branch.filedata, path: branch.path})
    })
  )

  return await savePromise
    .then(() => "saved" as SaveState)
    .catch((err) => "save error" as SaveState)
}
