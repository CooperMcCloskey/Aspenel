import type { TypedPropertySchema } from "./types";
import type { PropertyType } from "../types";
import { ulid } from "ulid";
import type { Mutable } from "$lib/types/utils";
import type { Id } from "$lib/bindings";
import { enforceExhaustiveSwitch } from "$lib/data/utils";

const propertySchemaFactoryMap: {[T in PropertyType]: (name: string, id: Id)=>Mutable<TypedPropertySchema<T>>} = {
  "Date": (name, id)=>({type: "Date", name, id, date_format: "DMY", time_format: "H24"}),
  "MultiSelect": (name, id)=>({type: "MultiSelect", name, id, options: [], categories: []}),
  "Number": (name, id)=>({type: "Number", name, id, min: undefined, max: undefined}),
  "Select": (name, id)=>({type: "Select", name, id, options: [], categories: []}),
  "Text": (name, id)=>({type: "Text", name,  id}),
} 

export function createPropertySchema<T extends PropertyType>(type: T): Mutable<TypedPropertySchema<T>> {
  const name = `New ${type == "MultiSelect" ? "Multi-select" : type}`;
  const id = ulid();
 
  return propertySchemaFactoryMap[type](name, id);
}

