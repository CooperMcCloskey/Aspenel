import type { PropertySchema } from "$lib/types/bindings/PropertySchema";
import { stateManager } from "../../../../../../lib/logic/state.svelte";
import type { LoadedPropertyValue } from "$lib/data/property/value/types";
import type { PropertyType } from "$lib/data/property/types";
import type { Id } from "$lib/types/bindings/Id";
import { renameElement } from "$lib/logic/uiLogic";
import { produce } from "immer";
import type { PropertyValue } from "$lib/types/bindings/PropertyValue";
import type { Mutable } from "$lib/types/utils";
import { getNode } from "$lib/data/branch/data";
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch";

export function attachProperty(property: Mutable<PropertySchema>){ stateManager.applyOperationRecipe((draft)=>{ draft.node.filedata.properties[property.id] = property}) }

export function updatePropertyValue<T extends PropertyType>(p: LoadedPropertyValue<T>){
  stateManager.applyOperationRecipe((draft) => {
    const propertyId = p.schemaData.id
    const branch = getNode(draft, p.branchPath).node as Mutable<LoadedBranch>

    p.value === null ?
      delete branch.filedata.property_values[propertyId] : 
      branch.filedata.property_values[propertyId] = p as Mutable<PropertyValue>
  });
}

export function renameProperty(propertyElement: HTMLElement, propertyId: Id){
  renameElement(propertyElement, (name, draft) => {
    if(draft.node.filedata.properties[propertyId] == undefined) throw new Error(`Property Id: ${propertyId} does not exist on ${draft.node.filename}`)
    draft.node.filedata.properties[propertyId].name = name
  });
}

export function hideProperty(viewId: Id, propertyId: Id){
  stateManager.applyOperationRecipe((draft) => {
    const view = draft.node.filedata.child_views[viewId]
    if(view == undefined) throw new Error(`View id: ${viewId} does not exist on branch: ${draft.node.filename}`)
    switch (view.type) {
      case "Icon": { view.visible_property_ids = view.visible_property_ids.filter((id)=>id!==propertyId); return; }
      case "Table": { view.hidden_property_ids.push(propertyId); return; }
    }
  });
}

export function deleteProperty(propertyId: Id){ stateManager.applyOperationRecipe((draft)=>delete draft.node.filedata.properties[propertyId]) }