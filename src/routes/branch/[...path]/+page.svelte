<script lang="ts">
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
  import BranchFinder from "./_components/BranchFinder/BranchFinder.svelte";
  import BranchHeader from "./_components/BranchHeader.svelte";
  
  let { data } = $props();
  $effect(()=>{
    if(data.branch.id !== stateManager.rootBranch.id) stateManager.reset(data)
  })

  function handleKeydown(e: KeyboardEvent) {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
    const target = e.target as HTMLElement | null;
    if (target?.isContentEditable || target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;


    e.preventDefault();
    if (e.shiftKey) stateManager.redo();
    else stateManager.undo();
  }

</script>

<svelte:window onkeydown={handleKeydown} />

<BranchHeader name={stateManager.rootBranch.filename} path={stateManager.rootBranch.path ?? ""}/>

<div id="branchList">
  {#if stateManager.rootBranch.path !== undefined}
    <BranchFinder/>
  {/if}
</div>

<button 
  title="Save" 
  onclick={()=>{stateManager.save()}} 
  class:saving={stateManager.saveState == "saving"} 
  class:saveError={stateManager.saveState == "save error"}
  class:saved={stateManager.saveState == "saved"} 
  id="saveIndicator" 
></button>

<style>
#branchList{
  grid-area: 3/2/5/6;
}

#saveIndicator{
  position: absolute;
  width: 8px;
  height: 8px;
  bottom: 10px;
  right: 10px;
  border-radius: 50%;
  border: 2px solid var(--gray2);
}
.saved{
  background-color: var(--gray2);
}
</style>