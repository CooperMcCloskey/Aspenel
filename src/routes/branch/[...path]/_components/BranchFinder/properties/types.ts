import type { Component } from "svelte";
import NumberPropertyValue from "../views/TableView/PropertyValues/NumberPropertyValue.svelte";
import TextPropertyValue from "../views/TableView/PropertyValues/TextPropertyValue.svelte";
import DatePropertyValue from "../views/TableView/PropertyValues/DatePropertyValue.svelte";
import MultiSelectPropertyValue from "../views/TableView/PropertyValues/MultiSelectPropertyValue.svelte";
import SelectPropertyValue from "../views/TableView/PropertyValues/SelectPropertyValue.svelte";
import type { PropertyType } from "$lib/data/property/types";
import type { LoadedPropertyValue } from "$lib/data/property/value/types";

export type PropertyValueComponent<T extends PropertyType = PropertyType> = Component<{ propertyData: LoadedPropertyValue<T> }>

export const propertyValueComponentMap: {[T in PropertyType]: PropertyValueComponent<T>} = {
  Number: NumberPropertyValue,
  Text: TextPropertyValue,
  Date: DatePropertyValue,
  MultiSelect: MultiSelectPropertyValue,
  Select: SelectPropertyValue
}


