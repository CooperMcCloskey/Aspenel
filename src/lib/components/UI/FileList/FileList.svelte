<script lang="ts">
  import MoreHorizontalIcon from "$lib/components/icons/MoreHorizontalIcon.svelte";
  import FileIcon from "./FileViews/IconView/FileIcon.svelte";
  import IconView from "./FileViews/IconView/IconView.svelte";

  export let dir: string = "home/";
  export let viewType: string;
</script>

<div id="container">
  <header>
    <p id="path">{dir}</p>
    <div id="editIcon"><MoreHorizontalIcon size=24/></div>
  </header>
  <div id="fileViews">
    {#if viewType == "icon"}
      <IconView rows=1 columns=4>
        <FileIcon color="var(--red)" name="School"></FileIcon>
        <FileIcon color="var(--yellow)" name="Life"></FileIcon>
        <FileIcon color="var(--blue)" name="Work"></FileIcon>
        <FileIcon color="var(--green)" name="Chores"></FileIcon>
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
  #editIcon{
    position: relative;
    top: -2px;
  }
  #fileViews{
    width: 100%;
    height: 100%;
  }
</style>