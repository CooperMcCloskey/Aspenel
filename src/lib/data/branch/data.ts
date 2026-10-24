import type { LoadedFields, RootFields } from "$lib/bindings";
import type { StateTreeRoot } from "$lib/logic/stateManager/types";
import type { UntypedBranchVariant } from "./types";


export function newEmptyLoadedFields(): LoadedFields {
  return {
    filename: "...",
    computed_color: {type: "SystemColor", value: "gray2"},
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
    color: {type: "SystemColor", value: "gray2"},
    property_values: {},
    ...newEmptyLoadedFields(),
    ...newEmptyRootFields()
  } as T;
}

export function newStateTree(): StateTreeRoot { return {branch: newEmptyBranch()} }
