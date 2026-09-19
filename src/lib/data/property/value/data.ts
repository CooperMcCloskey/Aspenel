import type { PropertyValueValidationResult, LoadedPropertyValue } from "./types";
import type { LoadedPropertySchema } from "../schema/types";
import type { TypedPropertyValue } from "./types";
import type { PropertyType } from "../types";
import { checkDateValue } from "./variants/date";
import { checkMultiSelectValue } from "./variants/multiSelect";
import { checkNumberValue } from "./variants/number";
import { checkSelectValue } from "./variants/select";
import { checkTextValue } from "./variants/text";
import type { IdPath } from "$lib/data/utils";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

export type PropertyCheckFunction<T extends PropertyType> = (schema: LoadedPropertySchema<T>, value: unknown)=>PropertyValueValidationResult<T>
export const propertyValueValidatorMap: { [T in PropertyType]: PropertyCheckFunction<T> } = {
  "Date": checkDateValue,
  "MultiSelect": checkMultiSelectValue,
  "Number": checkNumberValue,
  "Select": checkSelectValue,
  "Text": checkTextValue,
}

export function getLoadedProperty<T extends PropertyType>(schema: LoadedPropertySchema<T>, branchPath: IdPath): LoadedPropertyValue<T> {
  return {
    type: schema.type,
    value: getPropertyValue(schema, branchPath),
    schema,
    path: branchPath
  };
}

//TODO: Important; Make this function actually check rigorously and have fallbacks for when it fails
export function getPropertyValue<T extends PropertyType>(schema: LoadedPropertySchema<T>, branchPath: IdPath): TypedPropertyValue<T> | undefined {
  let branch = stateManager.nodeHandle(branchPath).branch;
  let value = branch.property_values[schema.id]?.value;
  // const checkResult = propertyValueValidatorMap[schema.type](schema, value);
  // if(checkResult.status === "error") throw new Error(`Invalid property value: ${value}`)
  return value as TypedPropertyValue<T>;
}
 

