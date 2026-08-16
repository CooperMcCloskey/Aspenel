import type { TypedPropertySchema } from "./types";
import type { PropertyType } from "../types";
import { ulid } from "ulid";
import type { Id } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

const propertySchemaFactoryMap: {[T in PropertyType]: (name: string, id: Id)=>TypedPropertySchema<T>} = {
  "Date": (name, id)=>({type: "Date", name, id, date_format: "DMY", time_format: "H24"}),
  "MultiSelect": (name, id)=>({type: "MultiSelect", name, id, options: {}}),
  "Number": (name, id)=>({type: "Number", name, id, min: undefined, max: undefined}),
  "Select": (name, id)=>({type: "Select", name, id, options: {}}),
  "Text": (name, id)=>({type: "Text", name,  id}),
} 

export function newPropertySchema<T extends PropertyType>(type: T): TypedPropertySchema<T> {
  const name = `New ${type == "MultiSelect" ? "Multi-select" : type}`;
  const id = ulid();
 
  return propertySchemaFactoryMap[type](name, id);
}

export function getPropertySchema<T extends PropertyType = PropertyType>(schemaId: Id, type?: T): TypedPropertySchema<T>{
  const schema = stateManager.tree.branch.properties[schemaId];
  if(schema === undefined) throw new Error(`Schema (type: ${type}) with id: ${schemaId} not found.`);
  if(type !== undefined && schema.type !== type) throw new Error(`Schema with id: ${schemaId} has type: ${schema.type} not ${type}`);
  return schema as TypedPropertySchema<T>
}