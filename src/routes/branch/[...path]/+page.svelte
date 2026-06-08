<script lang="ts">
  import BranchFinder from "./_components/BranchFinder/BranchFinder.svelte";
  import BranchHeader from "./_components/BranchHeader.svelte";
  import { filedata, appendChildFiledata, setFiledata, unsetChildFiledata, unsetFiledata } from "./_logic/filedata.svelte";
  import { saveManager } from "./_logic/saving.svelte";
  
  let { data } = $props();
  let { branchLoadData, childLoadData } = $derived(data)

  $effect(()=>{ 
    setFiledata(branchLoadData); 
    appendChildFiledata(childLoadData)

    return ()=>{
      unsetFiledata();
      unsetChildFiledata();
    }
  })
</script>

<BranchHeader name={filedata.filename} path={filedata.path ?? ""}/>

<div id="branchList">
  {#if filedata.path !== undefined}
    <BranchFinder/>
  {/if}
</div>

<button 
  title="Save" 
  onclick={()=>{saveManager.save()}} 
  class:saving={saveManager.saving} 
  class:saveError={saveManager.saveError}
  class:saved={saveManager.saved} 
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