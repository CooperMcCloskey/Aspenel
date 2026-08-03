import type { CheckValueResult, LoadedPropertyValue } from "./types";
import type { TypedPropertySchema } from "../schema/types";
import type { TypedPropertyValue } from "./types";
import type { PropertyType } from "../types";
import { checkDateValue } from "./variants/date";
import { checkMultiSelectValue } from "./variants/multiSelect";
import { checkNumberValue } from "./variants/number";
import { checkSelectValue } from "./variants/select";
import { checkTextValue } from "./variants/text";
import type { IdPath } from "$lib/data/branch/types";
import { stateManager } from "$lib/logic/state.svelte";
import type { PropertySchema } from "$lib/bindings";

export type PropertyCheckFunction<T extends PropertyType> = (schema: TypedPropertySchema<T>, value: unknown)=>CheckValueResult<T>
export const propertyCheckMap: { [T in PropertyType]: PropertyCheckFunction<T> } = {
  "Date": checkDateValue,
  "MultiSelect": checkMultiSelectValue,
  "Number": checkNumberValue,
  "Select": checkSelectValue,
  "Text": checkTextValue,
}

export function checkProperty<T extends PropertyType>(schema: TypedPropertySchema<T>, value: unknown): CheckValueResult<T> {
  return propertyCheckMap[schema.type](schema, value);
}

//TODO: Important; Make this function actually check rigorously and have fallbacks for when it fails
export function getPropertyValue<T extends PropertyType>(propertySchema: TypedPropertySchema<T>, branchPath: IdPath): TypedPropertyValue<T> | undefined {
  let branch = stateManager.getNode(branchPath).branch;
  let value = branch.property_values[propertySchema.id]?.value;
  if(value === undefined) return undefined;
  else{ 
    const checkResult = checkProperty<T>(propertySchema, value);
    if(checkResult.status === "error") throw new Error("Invalid")
  }
}

export function getLoadedProperty<T extends PropertyType>(schema: TypedPropertySchema<T>, branchPath: IdPath): LoadedPropertyValue<T> {
  return {
    type: schema.type,
    value: getPropertyValue(schema, branchPath),
    schema,
    branchPath
  };
}

