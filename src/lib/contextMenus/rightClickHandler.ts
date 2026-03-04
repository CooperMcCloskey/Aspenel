import type { Menu } from "@tauri-apps/api/menu";

export async function createContextMenu(event: MouseEvent, menuPromise: Promise<Menu>){
  event.preventDefault();
  const menu = await menuPromise;
  menu.popup();
}