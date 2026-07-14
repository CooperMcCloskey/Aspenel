import type { Branch } from "$lib/types/bindings/Branch";
import type { PropertySchema } from "$lib/types/bindings/PropertySchema";
import type { LoadedPropertyValue } from "./types";
import type { TypedPropertySchemaData } from "../schema/types";
import type { TypedPropertyValue } from "./types";
import type { PropertyType } from "../types";
import { splitSchema } from "../schema/data";
import { checkDateValue } from "./variants/date";
import { checkMultiSelectValue } from "./variants/multiSelect";
import { checkNumberValue } from "./variants/number";
import { checkSelectValue } from "./variants/select";
import { checkTextValue } from "./variants/text";
import type { IdPath } from "$lib/data/branch/types";
import { stateManager } from "$lib/logic/state.svelte";

export type PropertyCheckFunction<T extends PropertyType> = (schema: TypedPropertySchemaData<T>, value: unknown)=>TypedPropertyValue<T>
export const propertyCheckMap: { [T in PropertyType]: PropertyCheckFunction<T> } = {
  "Date": checkDateValue,
  "MultiSelect": checkMultiSelectValue,
  "Number": checkNumberValue,
  "Select": checkSelectValue,
  "Text": checkTextValue,
}

export function checkProperty<T extends PropertyType>(type: T, schema: TypedPropertySchemaData<T>, value: unknown): TypedPropertyValue<T> {
  return propertyCheckMap[type](schema, value);
}

//TODO: Important; Make this function actually check rigorously and have fallbacks for when it fails
export function getProperty<T extends PropertyType>(type: T, property: TypedPropertySchemaData<T>, branchPath: IdPath): TypedPropertyValue<T> | null {
  let branch = stateManager.getNode(branchPath).node;
  let value = branch.filedata.property_values[property.id]?.value ?? null;
  return value == null ? null : checkProperty<T>(type, property, value);
}

export function getLoadedProperty<T extends PropertyType>(schema: PropertySchema, branchPath: IdPath): LoadedPropertyValue<T> {
  const { type, schemaData } = splitSchema<T>(schema);
  return {
    type,
    value: getProperty(type, schemaData, branchPath),
    schemaData,
    branchPath: branchPath,
  };
}

