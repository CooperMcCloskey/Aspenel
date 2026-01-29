<script>
  export let color;
  export let name;

</script>

<button id="container" onclick={()=>{}}>
  <header style="background: {color}">
    <h2>{name}</h2>
  </header>
</button>

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
  h2{
    margin: 0;
    position: absolute;
    bottom: 0;
    left: 4px;
    bottom: -4px;
    color: var(--white);
  }
</style>
