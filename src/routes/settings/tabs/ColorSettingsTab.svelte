<script lang="ts">
  import type { ColorValue, ColorVariable, Settings } from "$lib/bindings";
  import ColorSwatch from "$lib/components/colors/ColorSwatch.svelte";
    import { resolveColorVariable } from "$lib/data/colors/conversion";
  import { toHex } from "$lib/data/colors/conversion";
  import RadioButtonGroup from "$lib/components/input/RadioButtonGroup.svelte";
  import { systemStringToDisplay } from "$lib/data/utils";
  import { settings } from "$lib/logic/settings.svelte";
    import type { Theme } from "@tauri-apps/api/window";
  import type { WritableDeep } from "type-fest";
  
  const { oldSettings }:{ oldSettings: Settings } = $props()

  const neutrals = $derived(settings.theme.system_color_variables.neutrals);
  const accents = $derived(settings.theme.system_color_variables.accents);

  function singleColorVariableBinding(cv: WritableDeep<ColorVariable & {type: "Single"}>){
    return ({
      get: ()=>({type: "HexColor", value: cv.value} as ColorValue),
      set: (color: ColorValue)=>{cv.value = toHex(color).value}
    })
  }
  function splitColorVariableBinding(cv: WritableDeep<ColorVariable & {type: "Split"}>){
    return ({
      light: {
        get: ()=>({type: "HexColor", value: cv.value.light} as ColorValue),
        set: (color: ColorValue)=>{cv.value.light = toHex(color).value}
      },
      dark: {
        get: ()=>({type: "HexColor", value: cv.value.dark} as ColorValue),
        set: (color: ColorValue)=>{cv.value.dark = toHex(color).value}
      }
    });
  }

</script>
<div id="colorContainer">
  <div id="neutrals">
    <div id="schemeRow">
      <span>Scheme: </span>
      <RadioButtonGroup 
        bind:value={settings.selected_scheme} 
        options={["system", "light", "dark"]}
        --first-child-padding="0"
      />
    </div>
    
    {#each Object.entries(neutrals) as [key, cv]}
      {@const name = systemStringToDisplay(key)}
      <div class="neutral" class:single={cv.type === "Single"}>
        {#if cv.type === "Single"}
          {@const bindings = singleColorVariableBinding(cv)}
          <ColorSwatch 
            name={name} 
            bind:color={bindings.get, bindings.set}
          />
        {:else}
          {@const bindings = splitColorVariableBinding(cv)}
          <ColorSwatch 
            name={name} 
            bind:color={bindings.light.get, bindings.light.set} 
            schemeOverride={"light"}
          />
          <ColorSwatch 
            name={name} 
            bind:color={bindings.dark.get, bindings.dark.set} 
            schemeOverride={"dark"}
          />
        {/if}
      </div>
    {/each}
  </div>

  <div id="accents">
    {#each Object.entries(accents) as [key, cv]}
      {@const name = systemStringToDisplay(key)}
      <div class="accent">
        {#if cv.type === "Single"}
          {@const bindings = singleColorVariableBinding(cv)}
          <ColorSwatch 
            name={name} 
            bind:color={bindings.get, bindings.set}
          />
        {:else}
          {@const bindings = splitColorVariableBinding(cv)}
          <div class="splitAccent">
            <div>
              <ColorSwatch 
                name={name} 
                bind:color={bindings.light.get, bindings.light.set} 
                schemeOverride={"light"}
              />
              <div class="themeIndicator lightIndicator"></div>
            </div>
            <div>
              <ColorSwatch 
                name={name} 
                bind:color={bindings.dark.get, bindings.dark.set}
                schemeOverride={"dark"}
              />
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
    gap: var(--standard-padding);
    width: 100%;
    height: 100%;
  }
  #schemeRow{
    grid-column: 1 / -1;
  }
  #neutrals{
    padding-bottom: var(--standard-padding);
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
    padding-top: var(--standard-padding);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--standard-padding);    
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
    top: var(--standard-padding);
    right: var(--standard-padding);
    width: var(--standard-text);
    height: var(--standard-text);
  }
  .lightIndicator{
    border: var(--border-width) solid var(--dark-gray0);
    background-color: var(--light-gray0);
  }
  .darkIndicator{
    border: var(--border-width) solid var(--light-gray0);
    background-color: var(--dark-gray0);
  }
</style>