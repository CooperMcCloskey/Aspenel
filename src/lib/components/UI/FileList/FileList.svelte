<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import NewProjectIcon from "$lib/components/icons/NewProjectIcon.svelte";
  import NewCategoryIcon from "$lib/components/icons/NewCategoryIcon.svelte";
  import IconView from "./IconView.svelte";

  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation";
  import type { FileData } from "$lib/types/rustTypes";
  import FileIcon from "./FileIcon.svelte";
    import { onMount } from "svelte";

  export let path: string = "home";
  let subDirs: FileData[];
  
  async function newFile(type: "project" | "category"){
    console.log(`going to: file/${type}/${path}/New ${type}`)
    await invoke('create_file', {path: `${path}/New ${type}/meta.json`, fileType: type});
    goto(`/file/${type}/${path}/New ${type}`);
  }

  onMount(async ()=>{
    subDirs = await invoke('read_dir', {path});
  })
</script>

<div id="container">
  <header>
    <p id="path">{path}</p>

    <div id="buttons">
      <button class="iconButton" id="newProjectButton" title="Create new project" onclick={()=>{newFile("project")}}><IconBase hasHoverEffect={true}><NewProjectIcon/></IconBase></button>
      <button class="iconButton" id="newCategoryButton" title="Create new category" onclick={()=>{newFile("category")}}><IconBase hasHoverEffect={true}><NewCategoryIcon/></IconBase></button>
      <button class="iconButton" id="moreButton" title="More"><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    </div>

  </header>
  <div id="fileViews">
    <IconView rows=1 columns=4>
      {#each subDirs as subDir}
        <FileIcon dir={subDir} path={path}/>
      {/each}
    </IconView>
  </div>
</div>

<style>
  #container{
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
  header{
    width: 100%;
    position: absolute;
    top: calc(-1 * var(--gridGapSize) - 2px);
    display: flex;
    justify-content: space-between;
    height: 16px;
  }
  #path{
    position: relative;
    font-family: 'JetBrains Mono';
    font-size: 16px;
    margin: 0;
  }
  #buttons{
    position: relative;
    top: -2px;
  }
  #fileViews{
    width: 100%;
    height: 100%;
  }
</style>