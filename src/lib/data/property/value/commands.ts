import type { PropertyValue } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
import type { PropertyType } from "../types";
import { propertyValueValidatorMap } from "./data";
import type { LoadedPropertyValue, PropertyValueValidationResult } from "./types";

export function setPropertyValue<T extends PropertyType>(property: LoadedPropertyValue<T>, value: unknown): PropertyValueValidationResult<T>{
  const type = property.type;
  const schemaId = property.schema.id;
  
  const checkValueResult = propertyValueValidatorMap[type](property.schema, value);
  if(checkValueResult.status === "ok"){
    const newValue = checkValueResult.data
    stateManager.nodeHandle(property.branchPath).applyCommand((node)=>{
      if(newValue === undefined) delete node.branch.property_values[schemaId];
      else node.branch.property_values[schemaId] = {type, value: newValue} as PropertyValue
    });
    return checkValueResult
  }
  else{ return checkValueResult }
}