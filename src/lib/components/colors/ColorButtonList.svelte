<script lang="ts">
  import type { ColorVariable } from "$lib/bindings";
  import { applyBackgroundColor } from "$lib/data/colors/contrast";
  import { resolveColorVariable } from "$lib/data/colors/conversion";
    import { systemStringToDisplay } from "$lib/data/utils";

  let {colors}: {colors: Record<string, ColorVariable>} = $props();
</script>

<div>
  {#each Object.entries(colors) as [key, color]}
    {@const colorName = systemStringToDisplay(key)}
    <button 
      title={colorName}
      style={applyBackgroundColor(resolveColorVariable(color))}
    ></button>
  {/each}
</div>

<style>
  button{
    width: var(--icon-size);
    height: var(--icon-size);
  }
</style>