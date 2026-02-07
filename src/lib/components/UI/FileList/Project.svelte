<script lang="ts">
  import type { ProjectData } from "$lib/types/rustTypes/ProjectData";

  export let dir: ProjectData;

</script>

<div id="container">
  <header>
    <a href={`/file/project/${dir.file.path}`}>{dir.file.name}</a>
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
