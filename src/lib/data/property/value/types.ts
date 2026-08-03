import type { PropertyValue } from "$lib/bindings";
import type { IdPath } from "$lib/data/branch/types";
import type { TypedPropertySchema } from "../schema/types";
import type { PropertyType } from "../types";


export type TypedPropertyValue<T extends PropertyType> = {
  [K in PropertyType]: Extract<PropertyValue, { type: K; }>["value"];
}[T];

export type LoadedPropertyValue<T extends PropertyType> = {
  readonly type: T;
  readonly schema: TypedPropertySchema<T>;
  readonly value: TypedPropertyValue<T> | undefined;
  readonly branchPath: IdPath;
};

export type CheckValueResult<T extends PropertyType> = {
  readonly status: "ok",
  readonly data: TypedPropertyValue<T> | undefined
} | {
  readonly status: "error",
  readonly error: string
}

