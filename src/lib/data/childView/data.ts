import { type ChildViewType } from "./types";
import { childViewComponentMap, type ChildViewComponent } from "../../../routes/branch/[...path]/_components/BranchFinder/views/map";
import { ulid } from "ulid";
import type { Mutable } from "$lib/types/utils";
import type { ChildView } from "$lib/bindings";
import { enforceExhaustiveSwitch } from "../utils";

export function createChildView(type: ChildViewType): Mutable<ChildView> { 
  const name = `${type} View`;
  const id = ulid();

  switch (type){
    case "Icon": return {type, name, id, visible_property_ids: []}
    case "Table": return {type, name, id, hidden_property_ids: []}
    default: enforceExhaustiveSwitch(type); 
  }
}

export function getChildView<T extends ChildViewType>(type: T): ChildViewComponent<T>{
  return childViewComponentMap[type];
}