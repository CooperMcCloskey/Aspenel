<script lang="ts">
  import { Menu } from "@tauri-apps/api/menu";
  import FileIconHeader from "./DocumentIconHeader.svelte";
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import { deleteDocument } from "$lib/filesystem/utils";

  //TODO: Make this icon able to be dragged and rearranged.

  let {
    filename, 
    path, 
    color,
    viewUpdateCallback,
  }: {
    filename: string, 
    path: string, 
    color: string
    viewUpdateCallback: ()=>void
  } = $props();

  function createMenu(): Promise<Menu>{
    return Menu.new({
      items: [
        { id: "delete", text: "Delete", action: ()=>{deleteDocument(filename, path, viewUpdateCallback)}},
        { id: "ctx_option2", text: "Option 2" },
      ],
    })
  } 
  
</script>

<div role="presentation" id="container" oncontextmenu={(e)=>{createContextMenu(e, createMenu())}}>
  <FileIconHeader filename={filename} path={path} color={color} filetype="leaf" />
</div>

<style>
  #container{
    height: 100%;
    position: relative;
    grid-column: span 1;
    grid-row: span 1;
    background: var(--white);
    cursor: pointer;
  }
  
</style>
