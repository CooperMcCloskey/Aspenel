import { type BranchViewType, type TypedBranchView } from "./types";
import { ulid } from "ulid";
import type { Id } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

const branchViewFactoryMap: {[T in BranchViewType]: (name: string, id: Id)=>TypedBranchView<T>} = {
  "Icon": (name, id)=>({type: "Icon", name, id, visible_property_ids: []}),
  "Table": (name, id)=>({type: "Table", name, id, hidden_property_ids: []})
}

export function newBranchView<T extends BranchViewType>(type: T): TypedBranchView<T> { 
  const name = `${type} View`;
  const id = ulid();

  return branchViewFactoryMap[type](name, id);
}

export function getView<T extends BranchViewType = BranchViewType>(viewId: Id, type?: T): TypedBranchView<T>{
  const view = stateManager.tree.branch.modules[viewId];
  if(view === undefined) throw new Error(`View (type: ${type}) with id: ${viewId} not found.`);
  if(type !== undefined && view.type !== type) throw new Error(`View with id: ${viewId} has type: ${view.type} not ${type}`);
  return view as TypedBranchView<T>
}