import type { Id, PropertySchema } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
import { renameElement } from "$lib/logic/uiLogic";
import type { WritableDeep } from "type-fest";
import type { PropertyType } from "../types";
import { getPropertySchema, newPropertySchema } from "./data";
import type { LoadedPropertySchema } from "./types";
import { ulid } from "ulid";


export function createPropertySchema<T extends PropertyType>(type: T) { 
  const schema: LoadedPropertySchema<T> = newPropertySchema(type);
  stateManager.applyCommand(()=>stateManager.tree.branch.properties[ulid()] = schema);
}

export function renamePropertySchema(propertyElement: HTMLElement, schemaId: Id) {
  renameElement(propertyElement, (name) => {
    const schema = getPropertySchema(schemaId) as WritableDeep<PropertySchema>;
    schema.name = name;
  });
}

export function applySchemaCommand<T extends PropertyType = PropertyType>(schemaId: Id, command: (schema: WritableDeep<LoadedPropertySchema<T>>)=>void){
  const schema = getPropertySchema<T>(schemaId) as WritableDeep<LoadedPropertySchema<T>>;
  command(schema);
}

export function deletePropertySchema(schemaId: Id) { stateManager.applyCommand(()=>delete stateManager.tree.branch.properties[schemaId])}