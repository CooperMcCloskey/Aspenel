import type { LoadedBranch } from "../_types/LoadedBranch";
import type { Branch } from "$lib/types/rustTypes/Branch";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";

export function newEmptyBranch(): Branch{
  return {
    id: "0",
    color: "var(--gray)",
    child_view_data: [],
    property_values: {},
    child_properties: []
  }
}

export function emptyLoadedBranch(): LoadedBranch{
  return{
    branch: newEmptyBranch(),
    filename: "...",
    color: "var(--gray)",
    path: "..."
  }
}

export async function createBranch(path: string): Promise<LoadedBranch>{
  return await invoke<LoadedBranch>(`create_branch`, {path})
}