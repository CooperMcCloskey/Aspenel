import type { Id, PropertySchema } from "$lib/bindings";
import { getView } from "$lib/data/childView/data";
import type { ChildViewType, TypedChildView } from "$lib/data/childView/types";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
import { renameElement } from "$lib/logic/uiLogic";
import type { WritableDeep } from "type-fest";
import type { PropertyType } from "../types";
import { getPropertySchema, newPropertySchema } from "./data";
import type { TypedPropertySchema } from "./types";


export function createPropertySchema<T extends PropertyType>(type: T) { 
  const schema: TypedPropertySchema<T> = newPropertySchema(type);
  stateManager.applyCommand(()=>stateManager.tree.branch.properties[schema.id] = schema);
}

export function renamePropertySchema(propertyElement: HTMLElement, schemaId: Id) {
  renameElement(propertyElement, (name) => {
    const schema = getPropertySchema(schemaId) as WritableDeep<PropertySchema>;
    schema.name = name;
  });
}

const hidePropertyFunctionMap: {[T in ChildViewType]: (view: WritableDeep<TypedChildView<T>>, propertyId: Id)=>void} = {
  "Icon": (view, propertyId)=>{view.visible_property_ids = view.visible_property_ids.filter((id) => id!==propertyId)},
  "Table": (view, propertyId)=>{view.hidden_property_ids.push(propertyId)}
}
export function hidePropertySchema<T extends ChildViewType>(viewId: Id, propertyId: Id) {
  const view = getView(viewId) as WritableDeep<TypedChildView<T>>;
  const type = view.type as T;
  stateManager.applyCommand(()=>hidePropertyFunctionMap[type](view, propertyId))
}

export function deletePropertySchema(schemaId: Id) { stateManager.applyCommand(()=>delete stateManager.tree.branch.properties[schemaId])}