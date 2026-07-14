import type { Id } from "$lib/types/bindings/Id";
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch";
import type { Immutable } from "immer";

export type LoadedBranchNode = {node: LoadedBranch, children?: Record<Id, LoadedBranchNode>};
export type LoadedBranchNodeWithChildren = Required<LoadedBranchNode>
export type IdPath = Immutable<Id[]>;