import { Menu } from "@tauri-apps/api/menu";
import { newChildView } from "../data";
import { attachView } from "../commands";
import { viewTypes } from "../types";


export function createViewMenu(): Promise<Menu> {
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: () => attachView(newChildView(type)),
    }))
  })
}
