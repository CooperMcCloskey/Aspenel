<script lang="ts">
  import '$lib/styling/variables.css'
  import '$lib/styling/global.css'
  
  let { children } = $props();
</script>

{@render children()}
