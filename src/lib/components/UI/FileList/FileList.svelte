<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import NewProjectIcon from "$lib/components/icons/NewProjectIcon.svelte";
  import NewTaskIcon from "$lib/components/icons/NewTaskIcon.svelte";
  import NewCategoryIcon from "$lib/components/icons/NewCategoryIcon.svelte";
  import FileIcon from "./FileViews/IconView/FileIcon.svelte";
  import IconView from "./FileViews/IconView/IconView.svelte";
  import { goto } from "$app/navigation";

  export let dir: string = "home/";
  export let viewType: string;

  function newFile(){
    goto('category/a');
  }

</script>

<div id="container">
  <header>
    <p id="path">{dir}</p>
    <div id="buttons">
      <button class="iconButton" id="newTaskButton" title="Create new task" onclick={newFile}><IconBase hasHoverEffect={true}><NewTaskIcon/></IconBase></button>
      <button class="iconButton" id="newProjectButton" title="Create new project"><IconBase hasHoverEffect={true}><NewProjectIcon/></IconBase></button>
      <button class="iconButton" id="newCategoryButton" title="Create new category"><IconBase hasHoverEffect={true}><NewCategoryIcon/></IconBase></button>
      <button class="iconButton" id="moreButton" title="More"><IconBase hasHoverEffect={true}><MoreHorizontalIcon/></IconBase></button>
    </div>
  </header>
  <div id="fileViews">
    {#if viewType == "icon"}
      <IconView rows=1 columns=4>
        <FileIcon name="School" color="var(--red)"/>
        <FileIcon name="Work" color="var(--blue)"/>
      </IconView>
    {/if}
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
  #path{
    position: relative;
    font-family: 'JetBrains Mono';
    font-size: 16px;
    margin: 0;
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