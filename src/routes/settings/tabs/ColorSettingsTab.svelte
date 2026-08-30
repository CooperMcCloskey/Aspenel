<script lang="ts">
  import type { Settings } from "$lib/bindings";
  import ColorSwatch from "$lib/components/colors/ColorSwatch.svelte";
    import RadioButtonGroup from "$lib/components/RadioButtonGroup.svelte";
  import { systemStringToDisplay } from "$lib/data/utils";
  import { settings } from "$lib/logic/settings.svelte";
  
  const { oldSettings }:{ oldSettings: Settings } = $props()

  const neutrals = $derived(settings.theme.system_color_variables.neutrals);
  const accents = $derived(settings.theme.system_color_variables.accents);

</script>
<div id="colorContainer">
  <div id="neutrals">
    <div id="schemeRow">
      <span>Scheme: </span>
      <RadioButtonGroup 
        bind:value={settings.selected_scheme} 
        options={["System", "Light", "Dark"]}
        --first-child-padding="0"
      />
    </div>
    
    {#each Object.entries(neutrals) as [key, cv]}
      {@const name = systemStringToDisplay(key)}
      <div class="neutral" class:single={cv.type === "Single"}>
        {#if cv.type === "Single"}
          <ColorSwatch name={name} bind:hexValue={cv.value}/>
        {:else}
          <ColorSwatch name={name} bind:hexValue={cv.value.light} schemeOverride={true}/>
          <ColorSwatch name={name} bind:hexValue={cv.value.dark} schemeOverride={false}/>
        {/if}
      </div>
    {/each}
  </div>

  <div id="accents">
    {#each Object.entries(accents) as [key, cv]}
      {@const name = systemStringToDisplay(key)}
      <div class="accent">
        {#if cv.type === "Single"}
          <ColorSwatch name={name} bind:hexValue={cv.value}/>
        {:else}
          <div class="splitAccent">
            <div>
              <ColorSwatch name={name} bind:hexValue={cv.value.light}/>
              <div class="themeIndicator lightIndicator"></div>
            </div>
            <div>
              <ColorSwatch name={name} bind:hexValue={cv.value.dark}/>
              <div class="themeIndicator darkIndicator"></div>
            </div>
          </div>
        {/if}
      </div>       
    {/each}
  </div>
</div>

<style>
  #colorContainer{
    display: grid;
    grid-template-rows: 4fr 1fr;
    gap: var(--gridGapSize);
    width: 100%;
    height: 100%;
  }
  #schemeRow{
    grid-column: 1 / -1;
  }
  #neutrals{
    padding-bottom: var(--standardPadding);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-auto-rows: 1fr;
    justify-content: start; 
  }
  .neutral{
    position: relative;
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
  .neutral.single > :global(*){ 
    grid-column: 1 / -1;
  }
  
  #accents{
    padding-top: var(--standardPadding);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--standardPadding);    
  }
  .splitAccent{
    display: grid;
    grid-template-rows: 1fr 1fr;
    width: 100%;
    height: 100%;
  }
  .splitAccent > div{
    position: relative;
  }
  .themeIndicator{
    position: absolute;
    top: var(--standardPadding);
    right: var(--standardPadding);
    width: var(--standardText);
    height: var(--standardText);
  }
  .lightIndicator{
    border: var(--borderWidth) solid var(--dark-gray0);
    background-color: var(--light-gray0);
  }
  .darkIndicator{
    border: var(--borderWidth) solid var(--light-gray0);
    background-color: var(--dark-gray0);
  }
</style>