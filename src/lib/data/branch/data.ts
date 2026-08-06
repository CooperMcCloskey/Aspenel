import type { LoadedFields, RootFields } from "$lib/bindings";
import type { StateTreeRoot } from "$lib/logic/stateManager/types";
import type { UntypedBranchVariant } from "./types";


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


//TODO: Check how this behaves at runtime
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
