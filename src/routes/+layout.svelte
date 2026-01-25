<script lang="ts">
  import '$lib/styling/variables.css'
  import '$lib/styling/global.css'

  let { children } = $props();
</script>

<div id="grid">
  {@render children()}
</div>

<style>
  #grid{
    --gridRowBorders: calc(var(--gridRows) - 1);
    --gridColumnBorders: calc(var(--gridColumns) - 1);
    --gridUnitWidth: calc((100vh - var(--gridColumnBorders)*var(--gridGapSize))/var(--gridColumns));
    --gridUnitHeight: calc((100vh - var(--gridRowBorders)*var(--gridGapSize))/var(--gridRows));

    position: fixed;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(var(--gridRows), 1fr);
    grid-template-columns: repeat(var(--gridColumns), 1fr);
    gap: var(--gridGapSize);
  }
</style>
