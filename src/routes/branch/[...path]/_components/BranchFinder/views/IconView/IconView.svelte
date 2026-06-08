<script lang="ts">
  import type { IconViewData } from "$lib/types/rustTypes/IconViewData";
  import { childFiledata } from "../../../../_logic/filedata.svelte";
  import BranchFinderIcon from "./BranchFinderIcon.svelte";
  const {viewData}: {viewData: IconViewData} = $props();

  //TODO: currently repeated; see if this can be shared across components for performaance
  const childFiledataArray = $derived(Object.values(childFiledata))
</script>

<div id="container">
  {#each childFiledataArray as child}
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
