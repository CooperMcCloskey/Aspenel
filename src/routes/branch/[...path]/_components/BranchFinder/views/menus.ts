import { Menu, MenuItem, type MenuOptions } from "@tauri-apps/api/menu"
import { attachView } from "./operations"
import { viewTypes } from "./types"
import { createView } from "./data"

export function createViewMenu(): Promise<Menu>{
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: ()=>attachView(createView(type)),
    }))
  })
} 