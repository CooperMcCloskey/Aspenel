<script lang="ts">
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
    import NewCategoryIcon from "$lib/components/icons/NewCategoryIcon.svelte";
    import NewProjectIcon from "$lib/components/icons/NewProjectIcon.svelte";
    import NewTaskIcon from "$lib/components/icons/NewTaskIcon.svelte";
  import FileIcon from "./FileViews/IconView/FileIcon.svelte";
  import IconView from "./FileViews/IconView/IconView.svelte";

  export let dir: string = "home/";
  export let viewType: string;
</script>

<div id="container">
  <header>
    <p id="path">{dir}</p>
    <div id="buttons">
      <button id="newTaskButton" title="Create new task"><IconBase><NewTaskIcon/></IconBase></button>
      <button id="newProjectButton" title="Create new project"><IconBase><NewProjectIcon/></IconBase></button>
      <button id="newCategoryButton" title="Create new category"><IconBase><NewCategoryIcon/></IconBase></button>
      <button id="moreButton" title="More"><IconBase><MoreHorizontalIcon/></IconBase></button>
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