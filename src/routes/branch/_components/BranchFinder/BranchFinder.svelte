<script lang="ts">
  import { loadDir, createBranch } from "$lib/filesystem/utils";;
  import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
  import IconView from "./views/IconView/IconView.svelte";
  import TableView from "./views/TableView/TableView.svelte";
  import type { BranchViewData } from "$lib/types/rustTypes/DocumentViewData";
  import type { Component } from "svelte";
  import type { BranchViewProps } from "$lib/types/branchViews/BranchViewProps";
  import CreateView from "./views/CreateView/CreateView.svelte";
    import IconBase from "$lib/components/icons/IconBase.svelte";
    import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
    import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  
  const {path, color, viewDataList}: {path: string, color: string, viewDataList: BranchViewData[]} = $props();

  let refresh = $state(0);
  function refreshComponent(){ refresh++ }
  
  let childrenPromise: Promise<LoadedBranch[]> = $derived(loadDir(path, color, refresh));  
  
  const viewMap: Record<string, Component<BranchViewProps<BranchViewData>>> = {
    Icon: IconView,
    Table: TableView,
  }

  let defaultActiveViewData: null | BranchViewData = $derived(viewDataList?.[0] ?? null)
  let selectedActiveViewData: null | BranchViewData = $state(null);
  let activeViewData: null | BranchViewData = $derived(selectedActiveViewData ?? defaultActiveViewData)
  let ActiveView: null | Component<BranchViewProps<BranchViewData>> = $derived(viewMap?.[activeViewData?.type] ?? CreateView)

  async function newBranch(){
    const branch = await createBranch(path);
    refreshComponent();
  }

  

</script>

<div id="container">
  <header>
    <button title="More..." onclick={()=>{}}><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    <button title="New Branch" onclick={newBranch}><IconBase hasHoverEffect={true}><NewBranchIcon/></IconBase></button>
  </header>
  <div id="fileViews">
    <!-- TODO: Make rows and columns adjustable -->
    {#await childrenPromise}
      <p>...</p>
    {:then children} 
      <ActiveView {children} refreshPage={refreshComponent} viewData={activeViewData}/>
    {/await}
  </div>
</div>

<style>
  header{
    position: relative;
    bottom: var(--iconSpacing);
    gap: var(--iconSpacing);
    width: 100%;
    height: 24px;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  #container{
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
  #fileViews{
    width: 100%;
    height: 100%;
  }
</style>