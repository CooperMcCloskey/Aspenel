<script lang="ts">
  import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
  import type { Branch } from "$lib/types/rustTypes/Branch";
  import BranchFinder from "../_components/BranchFinder/BranchFinder.svelte";
  import BranchHeader from "../_components/BranchHeader.svelte";

  let { data }: { data: LoadedBranch } = $props();

  const filedata: Branch = $derived(data.fsBranch.branch); 
  const isBranch: boolean = $derived(filedata.has_children);
  const filename: string = $derived(data.fsBranch.filename);
  const color: string = $derived(data.color);
  const path: string = $derived(data.path);

  $effect(() => {
    console.log(path);
  });
</script>

<BranchHeader name={filename} path={path ?? ""} fileType={isBranch ? "Branch" : "Leaf"}/>

<div id="branchList">
  {#if path !== undefined}
    <BranchFinder path={path} color={color} viewDataList={filedata.child_view_data}/>
  {/if}
</div>

<style>
#branchList{
  grid-area: 3/2/5/6;
}
</style>