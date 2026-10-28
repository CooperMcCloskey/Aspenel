<script lang="ts" generics="ActiveViewType extends BranchViewType">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import  { type BranchViewType, type TypedBranchView } from "../../../../../lib/data/modules/branchView/types";
  import CreateView from "./views/CreateView/CreateView.svelte";
  import { branchViewComponentMap, type BranchViewComponent } from "./views/map";
  import { newChild } from "$lib/data/branch/commands";
  import type { BranchView } from "$lib/bindings";
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

  let defaultActiveView: null | BranchView = $derived(Object.values(stateManager.tree.branch.modules)[0] ?? null)
  let selectedActiveView: null | BranchView = $state(null);
  let activeView: null | TypedBranchView<ActiveViewType> = $derived(selectedActiveView ?? defaultActiveView) as null | TypedBranchView<ActiveViewType>
  let ActiveViewComponent: null | BranchViewComponent<ActiveViewType> = $derived(activeView === null ? null : branchViewComponentMap[activeView.type])
  
</script>

<div class="container">
  <header>
    <button title="More..."><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    <button title="New Branch" onclick={()=>newChild()}><IconBase hasHoverEffect={true}><NewBranchIcon/></IconBase></button>
  </header>
  <div class="fileViews">
    {#if activeView === null}
      <CreateView/>
    {:else}
      <ActiveViewComponent viewData={activeView}/>
    {/if}
  </div>
</div>

<style>
  header{
    position: relative;
    bottom: var(--icon-spacing);
    gap: var(--icon-spacing);
    width: 100%;
    height: var(--icon-size);
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .container{
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .fileViews{
    width: 100%;
    height: 100%;
  }
</style>