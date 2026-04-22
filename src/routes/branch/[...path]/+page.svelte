<script lang="ts">
  import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
  import type { Branch } from "$lib/types/rustTypes/Branch";
  import BranchFinder from "../_components/BranchFinder/BranchFinder.svelte";
  import BranchHeader from "../_components/BranchHeader.svelte";
  import { filedata, setFiledata } from "./filedata.svelte";
  import { createSaveManager, saveManager } from "../../../lib/filesystem/saving.svelte";
  
  let { data }: { data: LoadedBranch } = $props();
  $effect(()=>{setFiledata(data)})

</script>

<BranchHeader name={filedata.name} path={filedata.path ?? ""}/>

<div id="branchList">
  {#if filedata.path !== undefined}
    <BranchFinder/>
  {/if}
</div>

<button 
  title="Save" 
  onclick={()=>{saveManager.save(filedata.branch, filedata.path)}} 
  class:saving={saveManager.saving} 
  class:saveError={saveManager.saveError}
  class:saved={saveManager.saved} 
  id="saveIndicator" 
>
</button>


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