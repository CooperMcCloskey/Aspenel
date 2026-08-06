import type { PropertyType } from "$lib/data/property/types"
import type { PropertyValueValidationResult, LoadedPropertyValue } from "$lib/data/property/value/types"
import type { Component } from "svelte"
import NumberPropertyValue from "./NumberPropertyValue.svelte"
import TextPropertyValue from "./TextPropertyValue.svelte"
import DatePropertyValue from "./DatePropertyValue.svelte"
import MultiSelectPropertyValue from "./MultiSelectPropertyValue.svelte"
import SelectPropertyValue from "./SelectPropertyValue.svelte"

export type PropertyValueComponent<T extends PropertyType = PropertyType> = Component<{ property: LoadedPropertyValue<T>, checkResult: PropertyValueValidationResult<T> }>

export const propertyValueComponentMap: {[T in PropertyType]: PropertyValueComponent<T>} = {
  Number: NumberPropertyValue,
  Text: TextPropertyValue,
  Date: DatePropertyValue,
  MultiSelect: MultiSelectPropertyValue,
  Select: SelectPropertyValue
}


