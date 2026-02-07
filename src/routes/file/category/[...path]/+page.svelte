<script>
  import { page } from "$app/state";
  import FileList from "$lib/components/UI/FileList/FileList.svelte";
  import FileHeader from "../../_components/FileHeader.svelte";

  const path = $derived(page.params.path);
  let {data} = $props();
</script>


<FileHeader fileType="Category"/>

<div id="fileList">
  {#if path !== undefined}
    <FileList path={path}/>
  {/if}
</div>

<style>
#fileList{
  grid-area: 3/2/5/6;
}
</style>