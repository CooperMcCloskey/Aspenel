import { goto } from "$app/navigation";
import { stateManager } from "$lib/logic/operations.svelte";
import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
import type { FsBranch } from "$lib/types/rustTypes/FsBranch";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";

export function joinPath(base: string, part: string): Promise<string> {
  return invoke<string>("join_path", {base, part});
}

export async function separatePath(path: string): Promise<{separator: string, pathComponents: string[], cumulativePathComponents: string[]}>{
  const separator = await invoke<string>("get_path_separator");
  const pathComponents: string[] = await invoke("get_path_components", {path});
  const cumulativePathComponents: string[] = pathComponents.map((_, i) => pathComponents.slice(0, i+1).join(separator));
  return {separator, pathComponents, cumulativePathComponents}
}

export function getBranchHref(path: string){
  return path == "" ? "/branch/Home" : `/branch/${path}`;
}


export async function createBranch(path: string): Promise<FsBranch>{
  return await invoke<FsBranch>(`create_branch`, {path})
}

export async function deleteBranch(filename: string, path: string){
  const deleteConfirmed = await ask(`Are you sure you want to delete "${filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(deleteConfirmed) {
    await invoke('delete_file', {path});
    stateManager.refresh();
  }
}