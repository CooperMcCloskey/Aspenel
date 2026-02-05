<script lang="ts">
  import '$lib/styling/variables.css'
  import '$lib/styling/global.css'
  import IconBase from '$lib/components/icons/IconBase.svelte';
  import BackArrowIcon from '$lib/components/icons/BackArrowIcon.svelte';
  import { goto } from '$app/navigation';

  let { children } = $props();
  
  function backArrow(){
    goto("/")
  }
</script>


<div id="grid">
  {@render children()}
</div>
<button id="backArrowContainer" class="iconButton" onclick={backArrow}><IconBase color="var(--gray)" hasHoverEffect={true}><BackArrowIcon/></IconBase></button>

<style> 
  #grid{
    --gridRowBorders: calc(var(--gridRows) - 1);
    --gridColumnBorders: calc(var(--gridColumns) - 1);
    --gridUnitWidth: calc((100vh - var(--gridColumnBorders)*var(--gridGapSize))/var(--gridColumns));
    --gridUnitHeight: calc((100vh - var(--gridRowBorders)*var(--gridGapSize))/var(--gridRows));

    position: fixed;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(var(--gridRows), 1fr);
    grid-template-columns: repeat(var(--gridColumns), 1fr);
    gap: var(--gridGapSize);
  }
  #backArrowContainer{
    position: absolute;
    left: 5px;
    top: 5px;
  }
</style>
