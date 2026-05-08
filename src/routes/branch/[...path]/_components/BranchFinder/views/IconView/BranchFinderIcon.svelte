<script lang="ts">
  import { Menu } from "@tauri-apps/api/menu";
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import type { LoadedBranch } from "../../../../_types/LoadedBranch";
  import { getBranchHref } from "$lib/filesystem/utils";
    import { deleteBranch } from "../../operations";

  //TODO: Make this icon able to be dragged and rearranged.

  let { branch }: {branch: LoadedBranch} = $props();

  function createMenu(): Promise<Menu>{
    return Menu.new({
      items: [
        { id: "rename", text: "Rename", action: ()=>{/*TODO: Add renaming*/} },
        { id: "copy", text: "Copy", action: ()=>{/*TODO: Add copying pasting*/}},
        { id: "delete", text: "Delete", action: ()=>{deleteBranch(branch)}}, //TODO: Make this an operation that only actually deletes on save.
      ],
    })
  } 
  
</script>

<a id="container" href={getBranchHref(branch.path)} oncontextmenu={(e)=>{createContextMenu(e, createMenu())}}>
  <header style="background: {branch.color}">
    <h2>{branch.filename}</h2>
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
