import type { Id, PropertySchema } from "$lib/bindings";
import type { PropertyType } from "../types";

export type LoadedPropertySchema<T extends PropertyType> = Extract<PropertySchema, { type: T; }> & {id: Id};
