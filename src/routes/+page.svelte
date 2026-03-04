<script lang="ts">
  import DocumentList from "./document/_components/DocumentList/DocumentList.svelte";

  const date = new Date().toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'});

</script>

<header>
  <h1>{date}</h1>
</header>

<div id="fileList">
  <DocumentList path="Home"/>
</div>
<style>
  #fileList{
    grid-area: 3/2/5/6;
  }
  header{
    grid-area: 2/2/3/5;
  }
</style>
