import { type ChildViewType, type TypedChildView } from "./types";
import { ulid } from "ulid";
import type { Id } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

const childViewFactoryMap: {[T in ChildViewType]: (name: string, id: Id)=>TypedChildView<T>} = {
  "Icon": (name, id)=>({type: "Icon", name, id, visible_property_ids: []}),
  "Table": (name, id)=>({type: "Table", name, id, hidden_property_ids: []})
}

export function newChildView<T extends ChildViewType>(type: T): TypedChildView<T> { 
  const name = `${type} View`;
  const id = ulid();

  return childViewFactoryMap[type](name, id);
}

export function getView<T extends ChildViewType = ChildViewType>(viewId: Id, type?: T): TypedChildView<T>{
  const view = stateManager.tree.branch.ui_components[viewId];
  if(view === undefined) throw new Error(`View (type: ${type}) with id: ${viewId} not found.`);
  if(type !== undefined && view.type !== type) throw new Error(`View with id: ${viewId} has type: ${view.type} not ${type}`);
  return view as TypedChildView<T>
}