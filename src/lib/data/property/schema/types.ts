import type { PropertySchema } from "$lib/bindings";
import type { PropertyType } from "../types";

export type TypedPropertySchema<T extends PropertyType> = Extract<PropertySchema, { type: T; }>;
