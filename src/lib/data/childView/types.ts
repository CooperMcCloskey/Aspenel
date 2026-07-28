import type { ChildView } from "$lib/bindings";

export type ChildViewType = ChildView["type"];
export const viewTypes = ["Icon", "Table"] satisfies readonly ChildViewType[];

export type TypedChildView<T extends ChildViewType> = Extract<ChildView, {type: T}>

