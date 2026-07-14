import type { PropertySchema } from "$lib/types/bindings/PropertySchema";
import type { WithoutTypeDiscriminator } from "$lib/types/utils";
import type { PropertyType } from "../types";


export type TypedPropertySchemaData<T extends PropertyType> = WithoutTypeDiscriminator<Extract<PropertySchema, { type: T; }>>;
