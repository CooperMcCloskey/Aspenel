<script>
  export let color;
  export let name;
</script>

<div id="container">
  <header style="background: {color}">
    <h2>{name}</h2>
  </header>
</div>

<style>
  #container{
    height: 100%;
    grid-column: span 1;
    grid-row: span 1;
    background: var(--white);
  }
  header{
    position: relative;
    width: 100%;
    height: var(--gridUnitHeight);
  }
  h2{
    margin: 0;
    position: absolute;
    bottom: 0;
    left: 4px;
    bottom: -4px;
    color: var(--white);
  }
</style>
