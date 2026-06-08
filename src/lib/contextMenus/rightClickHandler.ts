import type { Menu } from "@tauri-apps/api/menu";

//TODO: Generalize since this is used for more than just context menus
export async function createContextMenu(event: MouseEvent, menuPromise: Promise<Menu>){
  event.preventDefault();
  const menu = await menuPromise;
  menu.popup();
}