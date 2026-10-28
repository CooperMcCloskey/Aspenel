<script lang="ts">
  import '$lib/styling/systemTheme.css'
  import '$lib/styling/global.css'
  import IconBase from '$lib/components/icons/IconBase.svelte';
  import BackArrowIcon from '$lib/components/icons/BackArrowIcon.svelte';
  import { goto } from '$app/navigation';
  import { applySettingsChanges, settings } from '$lib/logic/settings.svelte';

  const { children } = $props();

  $effect(()=>{applySettingsChanges(settings)})

  function backArrow(){
    //TODO: Make this work
    goto("/")
  }
</script>


<div id="grid">
  {@render children()}
</div>
<button id="backArrowContainer" onclick={backArrow}><IconBase hasHoverEffect={true}><BackArrowIcon/></IconBase></button>

<style> 
  #grid{
    --gridRowBorders: calc(var(--grid-rows) - 1);
    --gridColumnBorders: calc(var(--grid-columns) - 1);
    --gridUnitWidth: calc((100vh - var(--gridColumnBorders)*var(--standard-padding))/var(--grid-columns));
    --gridUnitHeight: calc((100vh - var(--gridRowBorders)*var(--standard-padding))/var(--grid-rows));

    position: fixed;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    gap: var(--standard-padding);
  }
  #backArrowContainer{
    position: absolute;
    left: 5px;
    top: 5px;
  }
</style>
