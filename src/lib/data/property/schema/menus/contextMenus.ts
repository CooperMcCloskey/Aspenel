import type { ChildView, Id } from "$lib/bindings";
import { Menu } from "@tauri-apps/api/menu";
import { deletePropertySchema } from "../commands";
import { hidePropertySchema } from "../commands";
import { renamePropertySchema } from "../commands";
import { createPropertySchema } from "../commands";
import { propertyTypes } from "../../types";


export function editPropertySchemaMenu(propertyElement: HTMLSpanElement, view: ChildView, propertyId: Id): Promise<Menu> {
  return Menu.new({
    items: [
      { text: "Rename", action: () => renamePropertySchema(propertyElement, propertyId) },
      { text: "Hide", action: () => hidePropertySchema(view.id, propertyId) },
      { text: "Delete", action: () => deletePropertySchema(propertyId) }
    ]
  });
}export function newPropertySchemaMenu(): Promise<Menu> {
  return Menu.new({
    items: propertyTypes.map(type => ({
      text: `New ${type == "MultiSelect" ? "Multi-select" : type}`,
      action: () => createPropertySchema(type),
    }))
  });
}

