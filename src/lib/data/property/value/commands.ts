import type { PropertyValue } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
import type { PropertyType } from "../types";
import type { LoadedPropertyValue, TypedPropertyValue } from "./types";

export function setPropertyValue<T extends PropertyType>(property: LoadedPropertyValue<T>, value: TypedPropertyValue<T> | undefined){
  const type = property.type;
  const schemaId = property.schema.id;

  stateManager.nodeHandle(property.path).applyCommand((node)=>{
    if(value === undefined) delete node.branch.property_values[schemaId];
    else node.branch.property_values[schemaId] = {type, value} as PropertyValue
  });
}