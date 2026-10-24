<script lang="ts" generics="ActiveViewType extends ChildViewType">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import  { type ChildViewType, type TypedChildView } from "../../../../../lib/data/childView/types";
  import CreateView from "./views/CreateView/CreateView.svelte";
  import { childViewComponentMap, type ChildViewComponent } from "./views/map";
  import { newChild } from "$lib/data/branch/commands";
  import type { ChildView } from "$lib/bindings";
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

  let defaultActiveView: null | ChildView = $derived(Object.values(stateManager.tree.branch.ui_components)[0] ?? null)
  let selectedActiveView: null | ChildView = $state(null);
  let activeView: null | TypedChildView<ActiveViewType> = $derived(selectedActiveView ?? defaultActiveView) as null | TypedChildView<ActiveViewType>
  let ActiveViewComponent: null | ChildViewComponent<ActiveViewType> = $derived(activeView === null ? null : childViewComponentMap[activeView.type])
  
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
    bottom: var(--iconSpacing);
    gap: var(--iconSpacing);
    width: 100%;
    height: var(--iconSize);
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