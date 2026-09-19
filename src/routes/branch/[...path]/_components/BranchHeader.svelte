<script lang="ts">
  import { goto } from "$app/navigation";
  import { branchHref, separatePath } from "$lib/logic/filesystem";
  import { commands } from "$lib/bindings";
  import { sep as separator } from "@tauri-apps/api/path"
  import Input from "$lib/components/input/Input.svelte";
  
  let {name, path}: {name: string, path: string} = $props()

  //FIXME: breaks on rename
  
  //separating path for the navigation at the top of the table.
  const pathComponents = $derived(await separatePath(path))

  async function nameUpdate(newName: string) {
    const newPath = await commands.renameFile(path, newName);
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
  
  <Input
    value={name}
    submit={nameUpdate}
    --font-size="var(--largeText)"
    --cursor="text"
  >
  </Input>

</header>

<style>
  header {
    grid-area: 2/2/3/6;
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
