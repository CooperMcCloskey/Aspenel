import { Menu } from "@tauri-apps/api/menu";
import { newBranchView } from "../data";
import { viewTypes } from "../types";
import { ulid } from "ulid";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";


export function createViewMenu(): Promise<Menu> {
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: () => stateManager.applyCommand(()=>{stateManager.tree.branch.modules[ulid()] = newBranchView(type)})
    }))
  })
}
