<script lang="ts">
  import { stateManager } from "$lib/logic/state.svelte";
  import BranchFinder from "./_components/BranchFinder/BranchFinder.svelte";
  import BranchHeader from "./_components/BranchHeader.svelte";
  
  let { data } = $props();
  $effect(()=>{
    stateManager.new(data)
    return ()=>{
      stateManager.new()
    }
  })

</script>

<BranchHeader name={stateManager.activeBranch.filename} path={stateManager.activeBranch.path ?? ""}/>

<div id="branchList">
  {#if stateManager.activeBranch.path !== undefined}
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
  border: 2px solid var(--gray);
}
.saved{
  background-color: var(--gray);
}
</style>