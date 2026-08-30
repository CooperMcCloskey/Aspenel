<script lang="ts">
    import type { Size } from "$lib/types/utils";
    import type { Snippet } from "svelte";

  let { 
    children,
    size = $bindable(),
  }:{
    children: Snippet,
    size: Size | undefined
  } = $props(); 

  let width: number | undefined = $state(undefined)
  let height: number | undefined = $state(undefined)

  $effect(()=>{
    if(width && height) size = {width, height}
  })
</script>

<div 
  id="measuringContainer" 
  bind:clientWidth={width} 
  bind:clientHeight={height}
>
  {@render children()}
</div>

<style>
  #measuringContainer{
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: max-content;
  }
</style>
