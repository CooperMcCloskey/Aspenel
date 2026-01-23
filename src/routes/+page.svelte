<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  const date = new Date().toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'});

</script>

<h1>{date}</h1>

<style>

</style>
