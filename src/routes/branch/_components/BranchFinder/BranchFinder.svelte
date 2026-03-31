<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";

  import { getBranchHref, joinPath, loadDir, newBranch, separatePath } from "$lib/filesystem/utils";;
  import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
  import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
  import IconView from "./views/IconView/IconView.svelte";
  import TableView from "./views/TableView/TableView.svelte";
  import type { BranchViewData } from "$lib/types/rustTypes/DocumentViewData";
  import type { Component } from "svelte";
  import type { BranchViewProps } from "$lib/types/branchViews/BranchViewProps";
  import CreateView from "./views/CreateView/CreateView.svelte";
  
  const {path, color, viewDataList}: {path: string, color: string, viewDataList: BranchViewData[]} = $props();

  let refresh = $state(0);
  function refreshPage(){ refresh++ }
  
  //separating path for the navigation at the top of the table.
  const {separator, pathComponents, cumulativePathComponents} = $derived(await separatePath(path))
  let childrenPromise: Promise<LoadedBranch[]> = $derived(loadDir(path, color, refresh));  
  
  const viewMap: Record<string, Component<BranchViewProps<BranchViewData>>> = {
    Icon: IconView,
    Table: TableView,
  }

  let defaultActiveViewData: null | BranchViewData = $derived(viewDataList?.[0] ?? null)
  let selectedActiveViewData: null | BranchViewData = $state(null);
  let activeViewData: null | BranchViewData = $derived(selectedActiveViewData ?? defaultActiveViewData)
  let ActiveView: null | Component<BranchViewProps<BranchViewData>> = $derived(viewMap?.[activeViewData?.type] ?? CreateView)

</script>

<div id="container">
  <header>
    <div id="pathDisplayContainer">
      {#each pathComponents as _, i}
        <a class="path link" href={getBranchHref(cumulativePathComponents[i])}>{pathComponents[i]}</a><span class="path pathSeparator">{separator}</span>
      {/each}
    </div>

    <div id="buttons">
      <button class="iconButton" id="moreButton" title="More"><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    </div>

  </header>
  <div id="fileViews">
    <!-- TODO: Make rows and columns adjustable -->
    {#await childrenPromise}
      <p>...</p>
    {:then children} 
      <ActiveView {children} {refreshPage} viewData={activeViewData}/>
    {/await}
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
    height: 12px;
  }
  .path{
    color: var(--gray);
    position: relative;
    font-family: 'JetBrains Mono';
    font-size: 12px;
    margin: 0;
  }
  .pathSeparator{
    cursor: default;
  }
  .link:hover{
    color: var(--black);
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