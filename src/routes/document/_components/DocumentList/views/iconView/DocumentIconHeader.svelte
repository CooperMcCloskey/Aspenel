<script lang="ts">
  const {
    filename,
    path,
    filetype,
    color
  }: {
    filename: string,
    path: string, 
    filetype: "tree" | "leaf", 
    color: string
  } = $props();

</script>

<header style="background: {color}">
  <a href={`/document/${path}`}>{filename}</a>
</header>

<style>
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