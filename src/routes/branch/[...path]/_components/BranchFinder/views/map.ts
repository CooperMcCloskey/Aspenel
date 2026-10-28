import type { BranchViewType, TypedBranchView } from "$lib/data/modules/branchView/types";
import type { Component } from "svelte";
import IconView from "./IconView/IconView.svelte";
import TableView from "./TableView/TableView.svelte";
import type { Id } from "$lib/bindings";

export type BranchViewComponent<T extends BranchViewType> = Component<{ id: Id, viewData: TypedBranchView<T>; }>;

export const branchViewComponentMap: {[T in BranchViewType]: BranchViewComponent<T>} = {
  Icon: IconView,
  Table: TableView,
};
