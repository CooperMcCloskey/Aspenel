import { stateManager } from "../../../../../../lib/logic/state.svelte";
import type { LoadedPropertyValue } from "$lib/data/property/value/types";
import type { PropertyType } from "$lib/data/property/types";
import { renameElement } from "$lib/logic/uiLogic";
import type { Mutable } from "$lib/types/utils";
import { getNode } from "$lib/data/branch/data";
import type { Id, LoadedBranch, PropertySchema, PropertyValue } from "$lib/bindings";

export function attachProperty(property: Mutable<PropertySchema>){ stateManager.applyOperationRecipe((draft)=>{ draft.branch.properties[property.id] = property}) }

export function updatePropertyValue<T extends PropertyType>(p: LoadedPropertyValue<T>){
  stateManager.applyOperationRecipe((draft) => {
    const propertyId = p.schemaData.id
    const branch = getNode(draft, p.branchPath).branch as Mutable<LoadedBranch>

    p.value === null ?
      delete branch.property_values[propertyId] : 
      branch.property_values[propertyId] = p as Mutable<PropertyValue>
  });
}

export function renameProperty(propertyElement: HTMLElement, propertyId: Id){
  renameElement(propertyElement, (name, draft) => {
    if(draft.branch.properties[propertyId] == undefined) throw new Error(`Property Id: ${propertyId} does not exist on ${draft.branch.filename}`)
    draft.branch.properties[propertyId].name = name
  });
}

export function hideProperty(viewId: Id, propertyId: Id){
  stateManager.applyOperationRecipe((draft) => {
    const view = draft.branch.ui_components[viewId]
    if(view == undefined) throw new Error(`View id: ${viewId} does not exist on branch: ${draft.branch.filename}`)
    switch (view.type) {
      case "Icon": { view.visible_property_ids = view.visible_property_ids.filter((id)=>id!==propertyId); return; }
      case "Table": { view.hidden_property_ids.push(propertyId); return; }
    }
  });
}

export function deleteProperty(propertyId: Id){ stateManager.applyOperationRecipe((draft)=>delete draft.branch.properties[propertyId]) }