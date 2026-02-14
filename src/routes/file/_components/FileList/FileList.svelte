<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import NewProjectIcon from "$lib/components/icons/NewProjectIcon.svelte";
  import NewCategoryIcon from "$lib/components/icons/NewCategoryIcon.svelte";
  import IconView from "./IconView.svelte";

  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation"; 
  import { onMount } from "svelte";
  import type { CategoryData } from "$lib/types/rustTypes/CategoryData";
  import type { ProjectData } from "$lib/types/rustTypes/ProjectData";
  import { isCategory, isProject } from "$lib/types/rustTypes/typeGuards";
  import Category from "./Category.svelte";
  import Project from "./Project.svelte";
  import type { Filedata } from "$lib/types/rustTypes/Filedata";
  
  const {path}: {path: string} = $props();
  let subdirs: Filedata[] = $derived(await invoke('read_dir', {path})); //experimental feature

  async function newCategory(){
    let categoryData: CategoryData = await invoke('create_category', {path})
    goto(`/file/category/${path + "/" + categoryData.file.name}`);
  }
  async function newProject(){
    let projectData: ProjectData = await invoke('create_project', {path})
    goto(`/file/project/${path + "/" + projectData.file.name}`);
  }
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
      {#each subdirs as subDir}
        {#if isCategory(subDir)}
          <Category parentPath={path} dir={subDir}/>
        {:else if isProject(subDir)}
          <Project parentPath={path} dir={subDir}/>
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