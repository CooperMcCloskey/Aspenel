<script lang="ts">
  import FileIconHeader from "./DocumentIconHeader.svelte";

  let {
    filename, 
    path, 
    color
  }: {
    filename: string, 
    path: string, 
    color: string
  } = $props();

</script>

<div id="container">
  <FileIconHeader filename={filename} path={path} color={color} filetype="leaf" />
</div>

<style>
  #container{
    height: 100%;
    position: relative;
    grid-column: span 1;
    grid-row: span 1;
    background: var(--white);
  }
  
</style>
