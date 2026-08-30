<script lang="ts">
  import { goto } from "$app/navigation";
  import { branchHref, separatePath } from "$lib/logic/filesystem";
  import { onCommit } from "$lib/logic/actions";
  import { commands } from "$lib/bindings";
  import { sep as separator } from "@tauri-apps/api/path"

  
  let {name, path}: {name: string, path: string} = $props()

  //FIXME: this is probably wrong
  //FIXME: if focused when redirected, a breaking error is caused.
  $effect(()=>{nameHeader.value = name})
  
  let nameHeader: HTMLInputElement;

  //separating path for the navigation at the top of the table.
  const pathComponents = $derived(await separatePath(path))

  async function nameUpdate() {
    const newPath = await commands.renameFile(path, nameHeader.value);
    goto(`/branch/${newPath}`); //TODO: save before changing the page
  }
</script>

<header>
  <div id="pathDisplayContainer">
    {#each pathComponents as pathComponent}
      <div class="pathComponent">
        <a class="path" href={branchHref(pathComponent.cumulative)}>{pathComponent.single}</a>
        <a class="path pathSeparator" href={branchHref(pathComponent.cumulative)}>{separator()}</a>
      </div>
    {/each}
  </div>

  <input
    bind:this={nameHeader}
    type="text" 
    placeholder={`New Branch`} 
    use:onCommit={nameUpdate}
  />
</header>

<style>
  header {
    grid-area: 2/2/3/6;
  }
  input {
    font-size: var(--largeText);
    font-weight: 400;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    text-overflow: ellipsis;
    width: 100%;
  }
  #pathDisplayContainer{
    width: 100%;
    position: absolute;
    top: 4px;
    height: 16px;
  }
  .pathComponent{
    display: inline;
    color: var(--gray2);
    position: relative;
    margin: 0;
    font-size: 0; /* eliminate space between component and separator */
  }
  #pathDisplayContainer:has(.path:hover) .path{
    color: var(--gray4)
  }
  .pathComponent:has(.path:hover) ~ .pathComponent .path {
    color: var(--gray2) !important;
  }
  .path{
    font-size: var(--smallText);
  }
  
</style>
