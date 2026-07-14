import type { Branch } from "$lib/types/bindings/Branch";
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch";
import { invoke } from "@tauri-apps/api/core";
import type { LoadedBranchNode, IdPath } from "./types";
import { stateManager } from "$lib/logic/state.svelte";
import { loadDir } from "$lib/logic/filesystem";

export function newEmptyBranch(): Branch {
  return {
    id: "0",
    color: "var(--gray)",
    child_views: {},
    property_values: {},
    properties: {}
  };
}

export function newEmptyLoadedBranch(): LoadedBranch {
  return {
    filedata: newEmptyBranch(),
    filename: "...",
    color: "var(--gray)",
    path: "..."
  };
}

export function newEmptyLoadedBranchNode(): LoadedBranchNode { return {node: newEmptyLoadedBranch()} }

export async function createBranch(path: string): Promise<LoadedBranch>{
  return await invoke<LoadedBranch>(`create_branch`, {path})
}

export function getNode(tree: LoadedBranchNode, path?: IdPath): LoadedBranchNode{
  let node = tree;
  for(const id of path ?? []) {
    if(node.children === undefined || node.children[id] === undefined) throw new Error(`Invalid Path: ${path}`)
    node = node.children[id];
  }
  return node
}