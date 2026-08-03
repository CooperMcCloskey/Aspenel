import type { Component } from "svelte";
import type { PropertyType } from "../../types";
import type { TypedPropertySchema } from "../../schema/types";
import NumberPropertySchemaConfigMenu from "../../schema/menus/configMenus/NumberPropertySchemaConfigMenu.svelte";

type PropertySchemaConfigMenu<T extends PropertyType> = Component<{schema: TypedPropertySchema<T>}>

export const propertySchemaConfigMenuMap: {[T in PropertyType]: PropertySchemaConfigMenu<T>} = {
  "Number": NumberPropertySchemaConfigMenu
}