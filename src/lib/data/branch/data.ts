import type { LoadedFields, RootFields } from "$lib/bindings";
import type { Mutable } from "$lib/types/utils";
import type { StateTreeNode, IdPath, StateTreeRoot, UntypedBranchVariant, StateTreeVariant } from "./types";

export function newEmptyLoadedFields(): LoadedFields {
  return {
    filename: "...",
    computed_color: "var(--gray)",
    path: "loading"
  }
}

export function newEmptyRootFields(): RootFields {
  return {
    properties: {},
    ui_components: {}
  }
}

export function newEmptyBranch<T extends UntypedBranchVariant>(): T {
  return {
    id: "0",
    color: "var(--gray)",
    property_values: {},
    ...newEmptyLoadedFields(),
    ...newEmptyRootFields()
  } as T;
}

export function newStateTree(): StateTreeRoot { return {branch: newEmptyBranch()} }

export function getNode<M extends boolean = false>(tree: StateTreeRoot, path?: IdPath): M extends true ? Mutable<StateTreeVariant> : StateTreeVariant{
  let node: StateTreeNode | StateTreeRoot = tree;
  for(const id of path ?? []) {
    if(node.children === undefined || node.children[id] === undefined) throw new Error(`Invalid Path: ${path}`)
    node = node.children[id];
  }
  return node
}