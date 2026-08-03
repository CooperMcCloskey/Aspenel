<script lang="ts">
  import type { LoadedBranch } from "$lib/bindings";
    import { branchEditMenu } from "$lib/data/branch/menus/contextMenus";
  import { createContextMenu } from "$lib/logic/contextMenus";
  import { branchHref } from "$lib/logic/filesystem";

  //TODO: Make this icon able to be dragged and rearranged.
  let { branch }: {branch: LoadedBranch} = $props();
</script>

<a id="container" href={branchHref(branch.path)} oncontextmenu={(e)=>createContextMenu(e, branchEditMenu([branch.id]))}>
  <header style="background: {branch.computed_color}">
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
    font-family: var(--fontFamily);
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
