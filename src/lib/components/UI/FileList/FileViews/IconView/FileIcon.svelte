<script lang="ts">
  export let color: string;
  export let name: string;
  export let path: string;

</script>

<div id="container">
  <header style="background: {color}">
    <a href={path}>{name}</a>
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
    text-decoration: underline solid var(--white) 5px;
  }
</style>
