<script lang="ts">
    import ColorPicker from '$lib/components/ColorPicker.svelte';

  let { data: settings } = $props();

  const tabs = ["Colors", "About"]
  let selectedTab = $state(tabs[0])
</script>

<header>
  <h1>Settings</h1>
  <div id="tabs">
    {#each tabs as tab}
      <label class="tab">
        <input 
          type="radio" 
          name="tabs" 
          value={tab}
          bind:group={selectedTab}
        >
        <span class="tabLabel">{tab}</span>
      </label>
    {/each}
  </div>
  <input type="radio">
</header>


<main>
  {#if selectedTab === "Colors"}
    <div id="colors">
    {#each Object.entries(settings.theme.system_color_variables) as color, index}
      <div class="color">
        <ColorPicker noThemeColors></ColorPicker> 
        <span>{color[0]}</span> 
      </div>
    {/each}
    </div>
  {/if}
</main>

<style>
  header{
    grid-area: 2/2/3/5;
  }
  main{
    grid-area: 3/2/5/6;
  }
  .tab{
    cursor: pointer;
    padding: var(--standardPadding);
  }
  .tab:first-child{
    padding-left: 0;
  }
  .tab input:checked + .tabLabel{
    font-weight: 500;
  }
  .color{
    position: relative;
  }
</style>




