<script lang="ts">
  export let rows: string;
  export let columns: string;
</script>

<div id="container" style={`--rows: ${rows}; --columns: ${columns}`}>
  <slot></slot>
</div>


<style>
  #container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: var(--gridGapSize);
  }
</style>
