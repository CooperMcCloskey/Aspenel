import { Menu } from "@tauri-apps/api/menu";
import { deleteChild } from "../commands";
import type { IdPath } from "$lib/data/utils";


export function branchEditMenu(path: IdPath): Promise<Menu> {
  return Menu.new({
    items: [
      { text: "Rename", action: () => { } },
      { text: "Copy", action: () => { } },
      { text: "Delete", action: () => { deleteChild(path) } }, //TODO: Make this an operation that only actually deletes on save.
    ],
  })
}
