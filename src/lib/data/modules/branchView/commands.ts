import type { WritableDeep } from "type-fest";
import type { BranchViewType, TypedBranchView } from "./types";
import type { Id } from "$lib/bindings";
import { getView } from "./data";

export function applyViewCommand<T extends BranchViewType>(viewId: Id, command: (v: WritableDeep<TypedBranchView<T>>)=>void){
  const view = getView(viewId) as WritableDeep<TypedBranchView<T>>;
  command(view);
}

export function hidePropertySchema(viewId: Id, propertyId: Id) {
  applyViewCommand(viewId, (v)=>{
    if(v.type === "Icon") v.visible_property_ids = v.visible_property_ids.filter((id) => id!==propertyId);
    else if(v.type === "Table") v.hidden_property_ids.push(propertyId);
    else throw new Error(`Tried to hide a property on ${JSON.stringify(v)}, which cant have hidden properties`)
  });
}