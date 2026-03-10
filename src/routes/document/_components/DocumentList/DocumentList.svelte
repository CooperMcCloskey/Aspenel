<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import IconView from "./views/iconView/IconView.svelte";

  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation"; 
  import { getDocumentHref, joinPath } from "$lib/filesystem/utils";;
  import DocumentIcon from "./views/iconView/DocumentIcon.svelte";
  import type { FsDocument } from "$lib/types/rustTypes/FsDocument";
  import NewLeafIcon from "$lib/components/icons/NewLeafIcon.svelte";
  import NewBranchIcon from "$lib/components/icons/NewBranchIcon.svelte";
  
  const {path}: {path: string} = $props();
  
  let separator = $state('');
  invoke<string>("get_path_separator").then((result)=>{separator = result});

  const pathComponents: string[] = $derived(await invoke("get_path_components", {path}));
  const cumulativePathComponents = $derived(pathComponents.map((_, i) => pathComponents.slice(0, i+1).join(separator)))

  let refresh = $state(0)
  let children: FsDocument[] = $derived(await loadChildren(path, refresh));
  
  function refreshPage(){
    console.log("refresh" + refresh)
    refresh++;
  }

  async function loadChildren(path: string, refresh: number){
    return await invoke<FsDocument[]>('read_dir', {path})
  }

  async function newDocument(type: "leaf" | "branch"){
    const newFsDocument = await invoke<FsDocument>(`create_${type}`, {path})
    goto(`/document/${await joinPath(path, newFsDocument.filename)}`);
  }
</script>

<div id="container">
  <header>
    <div id="pathDisplayContainer">
      {#each pathComponents as _, i}
        <a class="path link" href={getDocumentHref(cumulativePathComponents[i])}>{pathComponents[i]}</a><span class="path">{separator}</span>
      {/each}
    </div>

    <div id="buttons">
      <button class="iconButton" id="newProjectButton" title="Create new branch" onclick={()=>{newDocument("branch")}}><IconBase hasHoverEffect={true}><NewBranchIcon/></IconBase></button>
      <button class="iconButton" id="newCategoryButton" title="Create new leaf" onclick={()=>{newDocument("leaf")}}><IconBase hasHoverEffect={true}><NewLeafIcon/></IconBase></button>
      <button class="iconButton" id="moreButton" title="More"><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    </div>

  </header>
  <div id="fileViews">
    <!-- TODO: Make rows and columns adjustable -->
    <IconView rows=1 columns=4>
      {#each children as fsNode}
        <DocumentIcon 
          filename={fsNode.filename} 
          path={await /*EXPERIMENTAL ASYNC*/ joinPath(path, fsNode.filename)} 
          color={await /*EXPERIMENTAL ASYNC*/ invoke('get_color', {path: await /*EXPERIMENTAL ASYNC*/ joinPath(path, fsNode.filename)})}
          viewUpdateCallback={refreshPage}
        />
      {/each}
    </IconView>
  </div>
</div>

<style>
  #container{
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
  header{
    width: 100%;
    position: absolute;
    top: calc(-1 * var(--gridGapSize) - 2px);
    display: flex;
    justify-content: space-between;
    height: 16px;
  }
  .path{
    position: relative;
    font-family: 'JetBrains Mono';
    font-size: 16px;
    margin: 0;
  }
  .link:hover{
    color: var(--blue);
  }
  #buttons{
    position: relative;
    top: -2px;
  }
  #fileViews{
    width: 100%;
    height: 100%;
  }
</style>