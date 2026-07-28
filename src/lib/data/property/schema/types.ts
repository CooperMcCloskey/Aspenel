import type { PropertySchema } from "$lib/bindings";
import type { WithoutTypeDiscriminator } from "$lib/types/utils";
import type { PropertyType } from "../types";


export type TypedPropertySchemaData<T extends PropertyType> = WithoutTypeDiscriminator<Extract<PropertySchema, { type: T; }>>;
