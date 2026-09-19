import type { Id, PropertyValue } from "$lib/bindings";
import type { IdPath } from "$lib/data/utils";
import type { Result } from "$lib/types/utils";
import type { LoadedPropertySchema } from "../schema/types";
import type { PropertyType } from "../types";


export type TypedPropertyValue<T extends PropertyType> = {
  [K in PropertyType]: Extract<PropertyValue, { type: K; }>["value"];
}[T];

export type LoadedPropertyValue<T extends PropertyType> = {
  readonly type: T;
  readonly value: TypedPropertyValue<T> | undefined;
  readonly schema: LoadedPropertySchema<T>;
  readonly path: IdPath;
};

export type PropertyValueValidationResult<T extends PropertyType> = Result<TypedPropertyValue<T> | undefined>
