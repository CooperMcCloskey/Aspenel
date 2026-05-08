<script lang="ts">
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import { Menu } from "@tauri-apps/api/menu";
  import { newView } from "../operations";
  import { stateManager } from "../../../../_logic/operations.svelte";

  function createMenu(): Promise<Menu>{
    return Menu.new({
      items: [
        { id: "icon", text: "New Icon View", action: ()=>{newView("Icon")} },
        { id: "table", text: "New Table View", action: ()=>{newView("Table")} },
      ],
    })
  } 
</script>

<button onclick={(e)=>{createContextMenu(e, createMenu())}}>Add sub-branches</button>

<style>
  button{
    color: var(--gray);
  }
  button:hover{
    color: var(--black)
  }
</style>