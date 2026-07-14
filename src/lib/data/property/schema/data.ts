import type { PropertySchema } from "$lib/types/bindings/PropertySchema";
import type { TypedPropertySchemaData } from "./types";
import type { PropertyType } from "../types";
import { ulid } from "ulid";
import type { Mutable } from "$lib/types/utils";


export function splitSchema<T extends PropertyType>(schema: PropertySchema): { type: T; schemaData: TypedPropertySchemaData<T>; } {
  const { type, ...schemaData } = { ...schema };
  return { type: type as T, schemaData: schemaData as TypedPropertySchemaData<T> };
}

export function createPropertySchema(type: PropertyType): Mutable<PropertySchema> {
  const name = `New ${type == "MultiSelect" ? "Multi-select" : type}`;
  const id = ulid();

  switch (type) {
    case "Number": return {
      type,
      name,
      id,
      min: null,
      max: null,
    };
    case "Text": return {
      type,
      name, 
      id,
    };
    case "Date": return {
      type,
      name,
      id,
      date_format: "DMY",
      time_format: "H24",
    };
    case "MultiSelect": return {
      type,
      name,
      id,
      options: [],
      categories: [],
    };
    case "Select": return {
      type,
      name,
      id,
      options: [],
      categories: [],
    };
  }
}

