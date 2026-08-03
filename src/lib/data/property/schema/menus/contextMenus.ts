import type { ChildView, Id } from "$lib/bindings";
import { Menu } from "@tauri-apps/api/menu";
import { deletePropertySchema } from "../operations";
import { hidePropertySchema } from "../operations";
import { renamePropertySChema } from "../operations";
import { attachPropertySchema } from "../operations";
import { createPropertySchema } from "../data";
import { propertyTypes } from "../../types";


export function editPropertySchemaMenu(propertyElement: HTMLSpanElement, view: ChildView, propertyId: Id): Promise<Menu> {
  return Menu.new({
    items: [
      { text: "Rename", action: () => renamePropertySChema(propertyElement, propertyId) },
      { text: "Hide", action: () => hidePropertySchema(view.id, propertyId) },
      { text: "Delete", action: () => deletePropertySchema(propertyId) }
    ]
  });
}export function newPropertySchemaMenu(): Promise<Menu> {
  return Menu.new({
    items: propertyTypes.map(type => ({
      text: `New ${type == "MultiSelect" ? "Multi-select" : type}`,
      action: () => attachPropertySchema(createPropertySchema(type)),
    }))
  });
}

