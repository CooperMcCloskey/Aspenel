import { propertyTypes } from "./types";
import { createPropertySchema } from "./data";
import { Menu } from "@tauri-apps/api/menu";
import { attachPropertySchema } from "./operations";


export function newPropertyMenu(): Promise<Menu>{
  return Menu.new({
    items: propertyTypes.map(type => ({
      id: type,
      text: `New ${type == "MultiSelect" ? "Multi-select" : type}`,
      action: ()=>attachPropertySchema(createPropertySchema(type)),
    }))
  })
}