import type { ColorValue, Id, SelectOption } from "$lib/bindings";
import { getRandomColor } from "$lib/data/colors/utils";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
import { ulid } from "ulid";
import { getPropertySchema } from "../../schema/data";
import type { LoadedPropertySchema } from "../../schema/types";
import type { TypedPropertyValue } from "../types";
import type { WritableDeep } from "type-fest";

export function checkSelectValue(schema: LoadedPropertySchema<"Select">, value: unknown): TypedPropertyValue<"Select"> { throw new Error("Function not implemented"); }

export function getSelectOption(optionId: Id, schemaId: Id): SelectOption {
  const schema = getPropertySchema<"Select" | "MultiSelect">(schemaId);
  const option = schema.options[optionId];
  if(option === undefined) throw new Error(`Option on schema: ${schemaId} with id: ${optionId} not found`);
  return option;
}

export function newSelectOption(index: number, schemaId: Id){
  const newOption = {
    name: "New option",
    color: getRandomColor(index)
  }

  stateManager.applyCommand(()=>{
    const schema = getPropertySchema<"Select" | "MultiSelect">(schemaId);
    schema.options[ulid()] = newOption;
  })
}

export function applySelectOptionCommand(optionId: Id, schemaId: Id, command: (option: WritableDeep<SelectOption>)=>void){
  stateManager.applyCommand(()=>{
    const option = getSelectOption(optionId, schemaId);
    command(option);
  })
}