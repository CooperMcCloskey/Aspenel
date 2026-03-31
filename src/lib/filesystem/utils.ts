import { goto } from "$app/navigation";
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

export async function loadBranch(path: string | undefined): Promise<LoadedBranch>{
  if(path === undefined) throw new Error("Branch path undefined")

  const fsBranch: Promise<FsBranch> = invoke<FsBranch>('read_branch', {path}); //TODO: optimize to reduce the number of branch reads
  const color: Promise<string> = invoke<string>('find_color', {path})

  const result: Promise<LoadedBranch> = Promise.all([fsBranch, color]).then(([fsBranch,color])=>{return {fsBranch,color,path}})
  return result;
}

export async function loadDir(path: string, color: string, refresh: any = null): Promise<LoadedBranch[]>{
  let children = await invoke<FsBranch[]>('read_dir', {path});
  return Promise.all(
    children.map(async (child)=>{
      return {
        fsBranch: child,
        color: await invoke<string>('check_color', {path: await joinPath(path, child.filename), parentColor: color}),
        path: await joinPath(path, child.filename)
      }
    })
  )
}

export async function newBranch(path: string, type: "leaf" | "branch"){
  const newFsBranch = await invoke<FsBranch>(`create_${type}`, {path})
  goto(`/branch/${await joinPath(path, newFsBranch.filename)}`);
}

export async function deleteBranch(filename: string, path: string, viewUpdateCallback: ()=>void){
  const deleteConfirmed = await ask(`Are you sure you want to delete "${filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(deleteConfirmed) {
    await invoke('delete_file', {path});
    viewUpdateCallback();
  }
}