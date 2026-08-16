<script lang="ts">
  const date = new Date().toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'});

</script>

<header>
  <h1>{date}</h1>
</header>

<main>
  <a href="/branch/Home">home</a><br>
  <a href="/settings">settings</a>
</main>

<style>
  header{
    grid-area: 2/2/3/5;
  }
  main{
    grid-area: 3/2/5/6;
  }
</style>
