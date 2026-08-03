import type { LoadedBranch, PropertyValue } from "$lib/bindings";
import { getNode } from "$lib/data/branch/data";
import { stateManager } from "$lib/logic/state.svelte";
import type { Mutable } from "$lib/types/utils";
import type { PropertyType } from "../types";
import type { LoadedPropertyValue, TypedPropertyValue } from "./types";


export function updatePropertyValue<T extends PropertyType>(property: LoadedPropertyValue<T>, value: TypedPropertyValue<T> | undefined) {
  stateManager.applyOperationRecipe((draft) => {
    const type = property.type;
    const propertySchemaId = property.schema.id;
    const branch = getNode(draft, property.branchPath).branch as Mutable<LoadedBranch>;

    if (value === undefined) delete branch.property_values[propertySchemaId];
    else branch.property_values[propertySchemaId] = {type, value} as PropertyValue
  });
}
