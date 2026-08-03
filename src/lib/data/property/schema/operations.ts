import type { Id, PropertySchema } from "$lib/bindings";
import { enforceExhaustiveSwitch } from "$lib/data/utils";
import { stateManager } from "$lib/logic/state.svelte";
import { renameElement } from "$lib/logic/uiLogic";
import type { Mutable } from "$lib/types/utils";


export function attachPropertySchema(property: Mutable<PropertySchema>) { stateManager.applyOperationRecipe((draft) => { draft.branch.properties[property.id] = property; }); }

export function renamePropertySChema(propertyElement: HTMLElement, propertyId: Id) {
  renameElement(propertyElement, (name, draft) => {
    if (draft.branch.properties[propertyId] == undefined) throw new Error(`Property Id: ${propertyId} does not exist on ${draft.branch.filename}`);
    draft.branch.properties[propertyId].name = name;
  });
}

export function hidePropertySchema(viewId: Id, propertyId: Id) {
  stateManager.applyOperationRecipe((draft) => {
    const view = draft.branch.ui_components[viewId];
    if (view == undefined) throw new Error(`View id: ${viewId} does not exist on branch: ${draft.branch.filename}`);
    const type = view.type;
    switch (type) {
      case "Icon": { view.visible_property_ids = view.visible_property_ids.filter((id) => id !== propertyId); return; }
      case "Table": { view.hidden_property_ids.push(propertyId); return; }
      default: enforceExhaustiveSwitch(type);
    }
  });
}

export function deletePropertySchema(propertyId: Id) { stateManager.applyOperationRecipe((draft) => delete draft.branch.properties[propertyId]); }

