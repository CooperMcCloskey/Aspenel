import type { IdPath } from "$lib/data/branch/types";
import type { PropertyValue } from "$lib/types/bindings/PropertyValue";
import type { TypedPropertySchemaData } from "../schema/types";
import type { PropertyType } from "../types";


export type TypedPropertyValue<T extends PropertyType> = {
  [K in PropertyType]: Extract<PropertyValue, { type: K; }>["value"];
}[T];

export type LoadedPropertyValue<T extends PropertyType> = {
  type: T;
  schemaData: TypedPropertySchemaData<T>;
  value: TypedPropertyValue<T> | null;
  branchPath: IdPath;
};

