<script lang="ts">
  import { type Snippet } from "svelte";
  import MeasuringContainer from "./MeasuringContainer.svelte";
    import { fitsContainer, type Size } from "$lib/types/utils";

  const { ...rest }: Record<string, Snippet> = $props();
  const snippets = $derived(Object.values(rest));

  let containerSize: Size = $state({width: 0, height: 0});
  let snippetSizes: Size[] = $state([]);

  const chosenSnippet = $derived(snippets.find((_, i)=>fitsContainer(containerSize, snippetSizes[i])) ?? snippets.at(-1)!)
</script>

<div 
  id="container" 
  bind:clientWidth={containerSize.width}
  bind:clientHeight={containerSize.height}
> 
  {#each snippets as snippet, index}
    <MeasuringContainer children={snippet} bind:size={snippetSizes[index]} />
  {/each}

  {@render chosenSnippet()}

  <!-- <div id="debug">
    <span>container: {JSON.stringify(containerSize)}</span>
    <span>snippets: {JSON.stringify(snippetSizes)}</span>
  </div> -->
</div>

<style>
  #container{
    width: 100%;
    height: 100%;
  }
  /* #debug{
    color: rgb(255, 0, 255);
    position: absolute;
    top: 0;
    left: 0;
  } */
</style>