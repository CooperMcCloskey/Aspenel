import { propertyTypes } from "$lib/data/property/types";
import { createPropertySchema } from "$lib/data/property/schema/data";
import { Menu } from "@tauri-apps/api/menu";
import { attachProperty, deleteProperty, hideProperty, renameProperty } from "./operations";
import type { Id } from "$lib/types/bindings/Id";
import type { ChildView } from "$lib/types/bindings/ChildView";

export function newPropertyMenu(): Promise<Menu>{
  return Menu.new({
    items: propertyTypes.map(type => ({
      text: `New ${type == "MultiSelect" ? "Multi-select" : type}`,
      action: ()=>attachProperty(createPropertySchema(type)),
    }))
  })
}

export function editPropertyMenu(propertyElement: HTMLSpanElement, view: ChildView, propertyId: Id): Promise<Menu>{
  return Menu.new({
    items: [
      { text: "Rename", action: ()=>renameProperty(propertyElement, propertyId) },
      { text: "Hide", action: ()=>hideProperty(view.id, propertyId) },
      { text: "Delete", action: ()=>deleteProperty(propertyId) }
    ]
  })
}