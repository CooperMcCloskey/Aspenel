import type { WritableDeep } from "type-fest";
import type { ChildViewType, TypedChildView } from "./types";
import type { Id } from "$lib/bindings";
import { getView } from "./data";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

const hidePropertyFunctionMap: {[T in ChildViewType]: (view: WritableDeep<TypedChildView<T>>, propertyId: Id)=>void} = {
  "Icon": (view, propertyId)=>{view.visible_property_ids = view.visible_property_ids.filter((id) => id!==propertyId)},
  "Table": (view, propertyId)=>{view.hidden_property_ids.push(propertyId)}
}

export function hidePropertySchema<T extends ChildViewType>(viewId: Id, propertyId: Id) {
  const view = getView(viewId) as WritableDeep<TypedChildView<T>>;
  const type = view.type as T;
  stateManager.applyCommand(()=>hidePropertyFunctionMap[type](view, propertyId))
}