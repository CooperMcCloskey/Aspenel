import type { Component } from "svelte";
import type { PropertyType } from "../../../types";
import type { TypedPropertySchema } from "../../types";
import NumberPropertySchemaConfigMenu from "./NumberPropertySchemaConfigMenu.svelte"
import SelectPropertySchemaConfigMenu from "./SelectPropertySchemaConfigMenu.svelte";

export type PropertySchemaConfigMenu<T extends PropertyType> = Component<{schema: TypedPropertySchema<T> }>

export const propertySchemaConfigMenuMap: {[T in PropertyType]: PropertySchemaConfigMenu<T>} = {
  "Date": null,
  "MultiSelect": null,
  "Number": NumberPropertySchemaConfigMenu,
  "Select": SelectPropertySchemaConfigMenu,
  "Text": null,
}