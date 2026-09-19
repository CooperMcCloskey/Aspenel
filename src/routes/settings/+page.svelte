<script lang="ts">
  import { settings } from '$lib/logic/settings.svelte.js';
  import ColorSettingsTab from './tabs/ColorSettingsTab.svelte';
  import RadioButtonGroup from '$lib/components/input/RadioButtonGroup.svelte';

  //TODO: diff with old settings and add change indicators.
  //TODO: proxy the actual settings and keep undo redo history.
  const oldSettings = $state($state.snapshot(settings));

  const tabs = ["General", "Colors", "About"]
  let selectedTab = $state(tabs[0]!)
</script>

<header>
  <h1>{selectedTab}</h1>
</header>

<!-- TODO: add search as the top tab -->
<div class="tabs">
  <RadioButtonGroup 
    options={tabs} 
    bind:value={selectedTab} 
    --flex-direction="column"
    --first-child-padding="0"
  />
</div>

<main>
  {#if selectedTab === "Colors"}
    <ColorSettingsTab {oldSettings}/>
  {/if}
</main>

<style>
  header{
    grid-area: 2/2/3/5;
  }
  .tabs{
    grid-area: 3/1/8/2;
  }
  main{
    grid-area: 3/2/8/6;
  }
</style>




