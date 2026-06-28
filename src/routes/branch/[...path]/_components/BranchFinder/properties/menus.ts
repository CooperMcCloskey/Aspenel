import { propertyTypes } from "./types";
import { createPropertySchema } from "./data";
import { Menu } from "@tauri-apps/api/menu";
import { attachPropertySchema } from "./operations";
import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import { renameElement } from "$lib/utils/uiLogic";


export function newPropertyMenu(): Promise<Menu>{
  return Menu.new({
    items: propertyTypes.map(type => ({
      text: `New ${type == "MultiSelect" ? "Multi-select" : type}`,
      action: ()=>attachPropertySchema(createPropertySchema(type)),
    }))
  })
}

export function editPropertyMenu(propertyElement: HTMLSpanElement, property: PropertySchema): Promise<Menu>{
  return Menu.new({
    items: [
      {text: "Rename", action: ()=>renameElement(propertyElement, (name: string)=>property.identifier.name = name)},
      {text: "Hide", action: ()=>{/*TODO:*/}},
      {text: "Delete", action: ()=>{/*TODO:*/}}
    ]
  })
}