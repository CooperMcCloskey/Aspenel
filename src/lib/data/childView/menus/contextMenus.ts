import { Menu } from "@tauri-apps/api/menu";
import { createChildView } from "../data";
import { attachView } from "../operations";
import { viewTypes } from "../types";


export function createViewMenu(): Promise<Menu> {
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: () => attachView(createChildView(type)),
    }))
  })
}
