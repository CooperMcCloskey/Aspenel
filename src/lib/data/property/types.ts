import type { PropertySchema } from "$lib/bindings";

export type PropertyType = PropertySchema["type"];
export const propertyTypes = ["Date", "MultiSelect", "Number", "Select", "Text"] satisfies readonly PropertyType[];

