import type { Branch, Id, LoadedBranch, LoadedBranchVariant, LoadedRootBranch, RootBranch } from "$lib/bindings";

export type UntypedBranchVariant = Branch | LoadedBranch | RootBranch | LoadedRootBranch

export type NodeChildren = Record<Id, StateTreeNode>

export interface StateTreeRoot extends StateTreeVariant {readonly branch: LoadedRootBranch & {type: "LoadedRootBranch"}, readonly children?: NodeChildren};
export interface StateTreeNode extends StateTreeVariant {readonly branch: LoadedBranch & {type: "LoadedBranch"}, readonly children?: NodeChildren}
export type StateTreeVariant = {readonly branch: LoadedBranchVariant, readonly children?: NodeChildren}
export type ParentStateTreeVariant = Required<StateTreeVariant>

export type IdPath = readonly Id[];