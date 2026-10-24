import type { Component } from "svelte";
import type { PropertyType } from "../../types";
import type { LoadedPropertySchema } from "../../schema/types";
import NumberPropertySchemaConfigMenu from "../../schema/menus/configMenus/NumberPropertySchemaConfigMenu.svelte";
import SelectPropertySchemaConfigMenu from "../../schema/menus/configMenus/SelectPropertySchemaConfigMenu.svelte";

type PropertySchemaConfigMenu<T extends PropertyType> = Component<{schema: LoadedPropertySchema<T>}>

export const propertySchemaConfigMenuMap: {[T in PropertyType]: PropertySchemaConfigMenu<T>} = {
  "Number": NumberPropertySchemaConfigMenu,
  "Select": SelectPropertySchemaConfigMenu,
}