import { invoke } from "@tauri-apps/api/core";
import { joinPath } from "../../../../lib/filesystem/utils";
import type { LoadedBranch } from "../_types/LoadedBranch";

export async function loadDir(path: string, color: string): Promise<Record<string, LoadedBranch>>{
  const children = await invoke<LoadedBranch[]>('load_dir', {path});
  const entries = children.map(c =>[c.branch.id, c])
  return Object.fromEntries(entries);
}

export async function loadBranch(path: string): Promise<LoadedBranch>{
  return invoke<LoadedBranch>('load_branch', {path}); //TODO: optimize to reduce the number of branch reads
}