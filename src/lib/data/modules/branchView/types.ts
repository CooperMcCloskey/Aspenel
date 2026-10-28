import type { BranchView } from "$lib/bindings";

export type BranchViewType = BranchView["type"];
export const viewTypes = ["Icon", "Table"] satisfies readonly BranchViewType[];

export type TypedBranchView<T extends BranchViewType> = BranchView & {type: T}