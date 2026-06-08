import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import type { PropertyValue } from "$lib/types/rustTypes/PropertyValue";
import type { WithoutTypeDiscriminator } from "$lib/types/utils";
import type { Component } from "svelte";

export type PropertyType = PropertySchema["type"];
export const propertyTypes = ["Date", "MultiSelect", "Number", "Select", "Text"] satisfies readonly PropertyType[];

export type PropertySchemaData = WithoutTypeDiscriminator<PropertySchema>
export type PropertyValueData = WithoutTypeDiscriminator<PropertyValue>

type PropertyValueMap = {[K in PropertyValue as K["type"]]: Omit<K, "type">}
export type PropertyValueComponent = {[K in PropertyType]: Component<{valueData: PropertyValueMap[K]}>}