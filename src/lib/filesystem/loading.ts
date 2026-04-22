import type { FsBranch } from "$lib/types/rustTypes/FsBranch";
import { invoke } from "@tauri-apps/api/core";
import { joinPath } from "./utils";
import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";

export async function loadDir(path: string, color: string): Promise<LoadedBranch[]>{
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

export async function loadBranch(path: string | undefined): Promise<LoadedBranch>{
  if(path === undefined) throw new Error("Branch path undefined")

  const fsBranch: Promise<FsBranch> = invoke<FsBranch>('read_branch', {path}); //TODO: optimize to reduce the number of branch reads
  const color: Promise<string> = invoke<string>('find_color', {path})

  const result: Promise<LoadedBranch> = Promise.all([fsBranch, color]).then(([fsBranch,color])=>{return {fsBranch,color,path}})
  return result;
}