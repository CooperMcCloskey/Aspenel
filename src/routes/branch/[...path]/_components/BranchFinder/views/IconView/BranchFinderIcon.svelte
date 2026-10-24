<script lang="ts">
  import type { LoadedBranch } from "$lib/bindings";
  import { branchEditMenu } from "$lib/data/branch/menus/contextMenus";
  import { createContextMenu } from "$lib/logic/contextMenus";
  import { branchHref } from "$lib/logic/filesystem";
  import { applyBackgroundColor } from "$lib/data/colors/contrast";
  import { systemColors } from "$lib/data/colors/utils";

  //TODO: Make this icon able to be dragged and rearranged.
  let { branch }: {branch: LoadedBranch} = $props();
</script>

<a 
  class="container" 
  href={branchHref(branch.path)} 
  oncontextmenu={(e)=>createContextMenu(e, branchEditMenu([branch.id]))}
  style={applyBackgroundColor(systemColors.gray0)}
>
  <header style={applyBackgroundColor(branch.computed_color)}>
    <h2>{branch.filename}</h2>
  </header>
</a>

<style>
  .container{
    height: 100%;
    position: relative;
    grid-column: span 1;
    grid-row: span 1;
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
  }
  .container:hover > header > h2, .container:focus-visible > header > h2{
    text-decoration: underline solid var(--gray0) 2px;
  }
</style>
