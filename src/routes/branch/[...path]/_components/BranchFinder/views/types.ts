import type { ChildViewType, TypedChildView } from "$lib/data/childView/types";
import type { Component } from "svelte";
import IconView from "./IconView/IconView.svelte";
import TableView from "./TableView/TableView.svelte";

export type ChildViewComponent<T extends ChildViewType> = Component<{ viewData: TypedChildView<T>; }>;

export const childViewComponentMap: {[T in ChildViewType]: ChildViewComponent<T>} = {
  Icon: IconView,
  Table: TableView,
};
