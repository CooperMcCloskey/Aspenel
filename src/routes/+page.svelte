<script lang="ts">
  const date = new Date().toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'});

</script>

<header>
  <h1>{date}</h1>
</header>

<a href="/branch/Home">asdf</a>
<style>
  header{
    grid-area: 2/2/3/5;
  }
  a{
    position: absolute;
    top: 100px;
  }
</style>
