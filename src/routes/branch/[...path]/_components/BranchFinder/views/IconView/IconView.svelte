<script lang="ts">
  import type { IconBranchViewData, Id } from "$lib/bindings";
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
  import BranchFinderIcon from "./BranchFinderIcon.svelte";
  const { id, viewData }: { id: Id, viewData: IconBranchViewData} = $props();
  $effect(()=>{
    viewData;
    stateManager.rootNodeHandle.loadChildren();
  })
  
  const children = $derived(stateManager.rootNodeHandle.childArray)
  
</script>

<div class="container">
  {#each children as child}
    <BranchFinderIcon branch={child}/>
  {/each}
</div>

<style>
  .container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    grid-template-columns: repeat(4, 1fr);
    gap: var(--standard-padding);
  }
</style>
