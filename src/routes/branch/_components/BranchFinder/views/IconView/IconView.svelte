<script lang="ts">
  import type { BranchViewProps } from "$lib/types/branchViews/BranchViewProps";
  import type { IconViewData } from "$lib/types/rustTypes/IconViewData";
  import BranchFinderIcon from "./BranchFinderIcon.svelte";
  const {children, viewData, refreshPage}: BranchViewProps<IconViewData> = $props();
</script>

<div id="container">
  {#each children as child}
    <BranchFinderIcon
      filename={child.fsBranch.filename} 
      path={child.path} 
      color={child.color}
      viewUpdateCallback={refreshPage}
    />
  {/each}
</div>

<style>
  #container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gridGapSize);
  }
</style>
