import { Menu } from "@tauri-apps/api/menu";
import { deleteChild } from "../operations";
import type { IdPath } from "../types";


export function branchEditMenu(path: IdPath): Promise<Menu> {
  return Menu.new({
    items: [
      { text: "Rename", action: () => { } },
      { text: "Copy", action: () => { } },
      { text: "Delete", action: () => { deleteChild(path) } }, //TODO: Make this an operation that only actually deletes on save.
    ],
  })
}
