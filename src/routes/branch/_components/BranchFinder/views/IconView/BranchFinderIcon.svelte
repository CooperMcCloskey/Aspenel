<script lang="ts">
  import { Menu } from "@tauri-apps/api/menu";
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import { deleteBranch, getBranchHref } from "$lib/filesystem/utils";

  //TODO: Make this icon able to be dragged and rearranged.

  let {
    filename, 
    path, 
    color,
  }: {
    filename: string, 
    path: string, 
    color: string
  } = $props();

  function createMenu(): Promise<Menu>{
    return Menu.new({
      items: [
        { id: "rename", text: "Rename", action: ()=>{/*TODO: Add renaming*/} },
        { id: "copy", text: "Copy", action: ()=>{/*TODO: Add copying*/}},
        { id: "delete", text: "Delete", action: ()=>{deleteBranch(filename, path)}},
      ],
    })
  } 
  
</script>

<a id="container" href={getBranchHref(path)} oncontextmenu={(e)=>{createContextMenu(e, createMenu())}}>
  <header style="background: {color}">
    <h2>{filename}</h2>
  </header>
</a>

<style>
  #container{
    height: 100%;
    position: relative;
    grid-column: span 1;
    grid-row: span 1;
    background: var(--white);
    cursor: pointer;
  }
  header{
    position: absolute;
    top: 0;
    width: 100%;
    height: var(--gridUnitHeight);
  }
  h2{
    margin: 0;
    position: absolute;
    bottom: 0;
    left: 2px;
    color: var(--white);
  }
  #container:hover > header > h2, #container:focus-visible > header > h2{
    text-decoration: underline solid var(--white) 2px;
  }
</style>
