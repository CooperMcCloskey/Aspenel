<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import NewProjectIcon from "$lib/components/icons/NewProjectIcon.svelte";
  import NewCategoryIcon from "$lib/components/icons/NewCategoryIcon.svelte";
  import IconView from "./IconView.svelte";

  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation"; 
  import { onMount } from "svelte";
  import Category from "./Category.svelte";
  import Project from "./Project.svelte";
  import type { CategoryData } from "$lib/types/rustTypes/CategoryData";
  import type { ProjectData } from "$lib/types/rustTypes/ProjectData";
  import type { FileData } from "$lib/types/rustTypes/FileData";
  import { isCategory, isProject } from "$lib/types/rustTypes/typeGuards";
  
  export let path: string;

  let subDirs: FileData[];

  async function newCategory(){
    let categoryData: CategoryData = await invoke('create_category', {path})
    goto(`/file/category/${categoryData.file.path}`);
  }
  async function newProject(){
    let projectData: ProjectData = await invoke('create_project', {path})
    goto(`/file/project/${projectData.file.path}`);
  }

  onMount(async ()=>{
    subDirs = await invoke('read_dir', {path});
  })
</script>

<div id="container">
  <header>
    <p id="path">{path}</p>

    <div id="buttons">
      <button class="iconButton" id="newProjectButton" title="Create new project" onclick={()=>{newProject()}}><IconBase hasHoverEffect={true}><NewProjectIcon/></IconBase></button>
      <button class="iconButton" id="newCategoryButton" title="Create new category" onclick={()=>{newCategory()}}><IconBase hasHoverEffect={true}><NewCategoryIcon/></IconBase></button>
      <button class="iconButton" id="moreButton" title="More"><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    </div>

  </header>
  <div id="fileViews">
    <IconView rows=1 columns=4>
      {#each subDirs as subDir}
        {#if isCategory(subDir)}
          <Category dir={subDir}/>
        {:else if isProject(subDir)}
          <Project dir={subDir}/>
        {/if}
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