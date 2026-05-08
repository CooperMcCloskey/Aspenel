<script lang="ts">
  import { goto } from "$app/navigation";
  import { getBranchHref, separatePath } from "$lib/filesystem/utils";
  import { invoke } from "@tauri-apps/api/core";
  
  let {
    name,
    path, 
  }: {
    name: string, 
    path: string, 
  } = $props()
  $effect(()=>{
    nameHeader.value = name;
  })
  
  let nameHeader: HTMLInputElement;

  //separating path for the navigation at the top of the table.
  const {separator, pathComponents, cumulativePathComponents} = $derived(await separatePath(path))

  async function nameUpdate() {
    const newPath = await invoke<string>("rename_file", {oldPath: path, newName: nameHeader.value}); //TODO: review this
    goto(`/branch/${newPath}`);
  }
</script>

<header>
  <div id="pathDisplayContainer">
    {#each pathComponents as _, i}
      <div class="pathComponent">
        <a class="path" href={getBranchHref(cumulativePathComponents[i])}>{pathComponents[i]}</a>
        <a class="path pathSeparator" href={getBranchHref(cumulativePathComponents[i])}>{separator}</a>
      </div>
    {/each}
  </div>

  <input
    bind:this={nameHeader}
    type="text" 
    placeholder={`New Branch`} 
    onkeydown={(e)=>{ if (e.key == "Enter") nameHeader.blur()}}
    onblur={nameUpdate}
  />
</header>

<style>
  header {
    grid-area: 2/2/3/6;
  }
  input {
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    text-overflow: ellipsis;
    width: 100%;
  }
  #pathDisplayContainer{
    width: 100%;
    position: absolute;
    top: 0px;
    height: 16px;
  }
  .pathComponent{
    display: inline;
    color: var(--gray);
    position: relative;
    font-family: 'JetBrains Mono';
    margin: 0;
    font-size: 0; /* eliminate space between component and separator */
  }
  #pathDisplayContainer:has(.path:hover) .path{
    color: var(--black)
  }
  .pathComponent:has(.path:hover) ~ .pathComponent .path {
    color: var(--gray) !important;
  }
  .path{
    font-size: var(--smallText);
  }
  
</style>
