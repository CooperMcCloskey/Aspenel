<script lang="ts">
  import { page } from "$app/state";
  import DocumentHeader from "../_components/DocumentHeader.svelte";
  import DocumentList from "../_components/DocumentList/DocumentList.svelte";

  const {data} = $props();
  const filedata = $derived(data.fsDocument.document); 
  const isBranch = $derived(filedata.has_children)
  const filename = $derived(data.fsDocument.filename)
  const path = $derived(page.params.path);
</script>

<DocumentHeader name={filename} path={path ?? ""} fileType={isBranch ? "Branch" : "Leaf"}/>

<div id="documentList">
  {#if path !== undefined}
    <DocumentList path={path}/>
  {/if}
</div>

<style>
#documentList{
  grid-area: 3/2/5/6;
}
</style>