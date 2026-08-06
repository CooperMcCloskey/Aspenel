import type { Id, LoadedBranch, LoadedBranchVariant, LoadedRootBranch } from "$lib/bindings";
import type { IdPath } from "$lib/data/utils";
import type { WritableDeep } from "type-fest";

export type NodeChildren = Record<Id, StateTreeNode>
export interface StateTreeRoot extends StateTreeVariant {readonly branch: LoadedRootBranch & {type: "LoadedRootBranch"}, readonly children?: NodeChildren};
export interface StateTreeNode extends StateTreeVariant {readonly branch: LoadedBranch & {type: "LoadedBranch"}, readonly children?: NodeChildren}
export type StateTreeVariant = {readonly branch: LoadedBranchVariant, readonly children?: NodeChildren}
export type ParentStateTreeVariant = Required<StateTreeVariant>
export type SaveState = "edited" | "saving" | "saved" | "save error";

export type StateChange = {
  target: any,
  key: string | symbol,
  oldValue: unknown,
  newValue: unknown,
}

export type CommandHistoryEntry = {userCaused: boolean, changes: StateChange[]}

export type NodeHandle =  { 
  path: IdPath | undefined;
  get node(): StateTreeNode
  get branch(): LoadedBranch;
  get childArray(): LoadedBranch[];
  applyCommand(command: (node: WritableDeep<StateTreeNode>)=>void, userCaused?: boolean): void; 
  loadChildren(): Promise<void>
};