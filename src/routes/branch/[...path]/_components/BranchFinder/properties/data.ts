import { newIdentifier } from "$lib/data/identifier";
import type { Branch } from "$lib/types/rustTypes/Branch";
import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import { propertyTypes, propertyValueComponentMap, type LoadedProperty, type PropertyType, type PropertyValueComponent, type TypedPropertySchemaData, type TypedPropertyValue } from "./types";

type PropertyCheckFunction<T extends PropertyType> = (schema: TypedPropertySchemaData<T>, value: unknown)=>TypedPropertyValue<T>

const propertyCheckMap: {[T in PropertyType]: PropertyCheckFunction<T>} = {
  "Date": checkDateValue,
  "MultiSelect": checkMultiSelectValue,
  "Number": checkNumberValue,
  "Select": checkSelectValue,
  "Text": checkTextValue,
}

function checkProperty<T extends PropertyType>(type: T, schema: TypedPropertySchemaData<T>, value: unknown): TypedPropertyValue<T>{
  return propertyCheckMap[type](schema, value) 
}


export function checkDateValue(schema: TypedPropertySchemaData<"Date">, value: unknown): TypedPropertyValue<"Date">{throw new Error("Function not implemented")}
export function checkMultiSelectValue(schema: TypedPropertySchemaData<"MultiSelect">, value: unknown): TypedPropertyValue<"MultiSelect">{throw new Error("Function not implemented")}

export function checkNumberValue(schema: TypedPropertySchemaData<"Number">, value: unknown): TypedPropertyValue<"Number">{
  if(typeof value !== "number") throw Error(`Unknown property value: ${value}`);

  // const num: number = Number(value);
  if(Number.isNaN(value)) throw Error("Not a number");
  if(schema.min != null && value < schema.min) throw Error("Value exceeds the specified minimum");
  if(schema.max != null && value > schema.max) throw Error("Value exceeds the specified maximum");
  
  return value;
}

export function checkSelectValue(schema: TypedPropertySchemaData<"Select">, value: unknown): TypedPropertyValue<"Select">{throw new Error("Function not implemented")}
export function checkTextValue(schema: TypedPropertySchemaData<"Text">, value: unknown): TypedPropertyValue<"Text">{throw new Error("Function not implemented")}

//TODO: Important; Make this function actually check rigorously and have fallbacks for when it fails
function getProperty<T extends PropertyType>(type: T, schema: TypedPropertySchemaData<T>, branch: Branch): TypedPropertyValue<T> | null{
  let value = branch.property_values[schema.identifier.id]?.value ?? null;
  return value == null ? null : checkProperty<T>(type, schema, value)
}    

export function getLoadedProperty<T extends PropertyType>(type: T, schema: TypedPropertySchemaData<T>, branch: Branch): LoadedProperty<T> {
  return {
    type: type,
    value: getProperty(type, schema, branch),
    schema,
    branchID: branch.id
  }
}

export function getPropertyValueComponent<T extends PropertyType>(type: T): PropertyValueComponent<T>{
  return propertyValueComponentMap[type];
}

export function createPropertySchema(type: PropertyType): PropertySchema{
  const identifier = newIdentifier(`New ${type == "MultiSelect" ? "Multi-select" : type}`);

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