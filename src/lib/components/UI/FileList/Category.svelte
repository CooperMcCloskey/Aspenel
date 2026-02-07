<script lang="ts">
  import type { CategoryData } from "$lib/types/rustTypes/CategoryData";
  import type { FileData } from "$lib/types/rustTypes/FileData";

  export let dir: CategoryData;

</script>

<div id="container">
  <header style="background: {dir.color}">
    <a href={`/file/category/${dir.file.path}`}>{dir.file.name}</a>
  </header>
</div>

<style>
  #container{
    height: 100%;
    position: relative;
    grid-column: span 1;
    grid-row: span 1;
    background: var(--white);
  }
  header{
    position: absolute;
    top: 0;
    width: 100%;
    height: var(--gridUnitHeight);
  }
  a{
    font-size: 1.5em;
    margin: 0;
    position: absolute;
    bottom: 0;
    left: 4px;
    color: var(--white);
  }
  a:hover, a:focus-visible{
    text-decoration: underline solid var(--white) 2px;
  }
</style>
