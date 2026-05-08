<script lang="ts">
  import IconView from "./views/IconView/IconView.svelte";
  import TableView from "./views/TableView/TableView.svelte";
  import type { Component } from "svelte";
  import type { BranchViewProps } from "../../_types/BranchViewTypes";
  import CreateView from "./views/CreateView/CreateView.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import type { BranchView } from "$lib/types/rustTypes/BranchView";
  import { filedata } from "../../_logic/filedata.svelte";
  import { createBranch } from "../../_data/branch";
    import { newBranch } from "./operations";
  
  const viewComponentMap: Record<string, Component<BranchViewProps<any>>> = {
    Icon: IconView,
    Table: TableView,
  }

  let defaultActiveViewData: null | BranchView = $derived(filedata.branch.child_view_data[0] ?? null)
  let selectedActiveViewData: null | BranchView = $state(null);
  let activeViewData: null | BranchView = $derived(selectedActiveViewData ?? defaultActiveViewData)
  let ActiveView: null | Component<BranchViewProps<BranchView>> = $derived(viewComponentMap[activeViewData?.type] ?? CreateView)
</script>

<div id="container">
  <header>
    <button title="More..." onclick={()=>{}}><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    <button title="New Branch" onclick={()=>newBranch(filedata.path)}><IconBase hasHoverEffect={true}><NewBranchIcon/></IconBase></button>
  </header>
  <div id="fileViews">
    <!-- TODO: Make rows and columns adjustable -->
    <ActiveView viewData={activeViewData}/>
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