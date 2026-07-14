<script lang="ts">
  import { stateManager } from "$lib/logic/state.svelte";
  import type { IconViewData } from "$lib/types/bindings/IconViewData";;
  import { onMount } from "svelte";
  import BranchFinderIcon from "./BranchFinderIcon.svelte";
  const {viewData}: {viewData: IconViewData} = $props();

  stateManager.loadChildren();
  const children = $derived(stateManager.activeChildren)
  
</script>

<div id="container">
  {#each children as child}
    <BranchFinderIcon branch={child}/>
  {/each}
</div>

<style>
  #container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gridGapSize);
  }
</style>
