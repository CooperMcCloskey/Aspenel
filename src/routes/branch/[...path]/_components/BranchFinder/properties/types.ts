import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import type { Property } from "$lib/types/rustTypes/Property";
import type { WithoutTypeDiscriminator } from "$lib/types/utils";
import type { Component } from "svelte";
import NumberPropertyValue from "../views/TableView/PropertyValues/NumberPropertyValue.svelte";
import TextPropertyValue from "../views/TableView/PropertyValues/TextPropertyValue.svelte";
import DatePropertyValue from "../views/TableView/PropertyValues/DatePropertyValue.svelte";
import MultiSelectPropertyValue from "../views/TableView/PropertyValues/MultiSelectPropertyValue.svelte";
import SelectPropertyValue from "../views/TableView/PropertyValues/SelectPropertyValue.svelte";

export type PropertyType = PropertySchema["type"];
export const propertyTypes = ["Date", "MultiSelect", "Number", "Select", "Text"] satisfies readonly PropertyType[];

//intermediate map used for unions to behave properly.
export type TypedPropertyValue<T extends PropertyType> = {[K in PropertyType]: Extract<Property, {type: K}>["value"]}[T]
export type TypedPropertySchemaData<T extends PropertyType> = WithoutTypeDiscriminator<Extract<PropertySchema, { type: T }>>;

// export type PropertyValue<T extends PropertyType> = TypedProperty<T>["value"];

export type LoadedProperty<T extends PropertyType> = {
  type: T,
  schema: TypedPropertySchemaData<T>,
  value: TypedPropertyValue<T> | null,
  branchID: string,
}

//need a separate type for the T to distribute.
export type LoadedPropertyUnion = {[T in PropertyType]: LoadedProperty<T>}[PropertyType]

export type PropertyValueComponent<T extends PropertyType> = Component<{ propertyData: Extract<LoadedPropertyUnion, { type: T}> }>

export const propertyValueComponentMap: {[T in PropertyType]: PropertyValueComponent<T>} = {
  Number: NumberPropertyValue,
  Text: TextPropertyValue,
  Date: DatePropertyValue,
  MultiSelect: MultiSelectPropertyValue,
  Select: SelectPropertyValue
}


