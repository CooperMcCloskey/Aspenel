<script lang="ts">
  import { page } from "$app/state";
  import FileList from "../../_components/FileList/FileList.svelte";
  import FileHeader from "../../_components/FileHeader.svelte";

  const {data} = $props();
  const filedata = $derived(data.filedata);
  const path = $derived(page.params.path);
</script>

<FileHeader name={filedata.file.name} path={path ?? ""} fileType={"Category"}/>

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