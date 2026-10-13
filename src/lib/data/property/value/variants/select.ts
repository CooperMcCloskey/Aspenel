import type { HexColor, SelectOption } from "$lib/bindings";
import { getRandomColor } from "$lib/components/colors/data";
import type { LoadedPropertySchema } from "../../schema/types";
import type { TypedPropertyValue } from "../types";

export function checkSelectValue(schema: LoadedPropertySchema<"Select">, value: unknown): TypedPropertyValue<"Select"> { throw new Error("Function not implemented"); }

export function newSelectOption(index: number): SelectOption{
  return {
    name: "New option",
    color: getRandomColor(index)
  }
}