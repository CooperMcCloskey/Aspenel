<script lang="ts">
  import { page } from "$app/state";
    import type { LoadedDocument } from "$lib/types/fileHandling/DocumentLoadResult";
    import type { Document } from "$lib/types/rustTypes/Document";
    import type { FsDocument } from "$lib/types/rustTypes/FsDocument";
  import DocumentHeader from "../_components/DocumentHeader.svelte";
  import DocumentList from "../_components/DocumentList/DocumentList.svelte";

  let { data }: { data: LoadedDocument } = $props();

  const filedata: Document = $derived(data.fsDocument.document); 
  const isBranch: boolean = $derived(filedata.has_children);
  const filename: string = $derived(data.fsDocument.filename);
  const color: string = $derived(data.color);
  const path: string = $derived(data.path);

  $effect(() => {
    console.log(path);
  });
</script>

<DocumentHeader name={filename} path={path ?? ""} fileType={isBranch ? "Branch" : "Leaf"}/>

<div id="documentList">
  {#if path !== undefined}
    <DocumentList path={path} color={color}/>
  {/if}
</div>

<style>
#documentList{
  grid-area: 3/2/5/6;
}
</style>