import { newIdentifier } from "$lib/data/identifier";
import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import type { PropertyType } from "./types";


export function createPropertySchema(type: PropertyType): PropertySchema{
  const identifier = newIdentifier(`${type} View`);

  switch(type){
    case "Number": return {
      type,
      identifier,
      min: null,
      max: null,
    }
    case "Text": return {
      type,
      identifier,
    }
    case "Date": return {
      type,
      identifier,
      date_format: "DMY",
      time_format: "H24",
    }
    case "MultiSelect": return {
      type,
      identifier,
      options: [],
      categories: [],
    }
    case "Select": return {
      type,
      identifier,
      options: [],
      categories: [],
    }
  }
}