<script lang="ts">
  import type { ColorValue, HexColor, HSV } from "$lib/bindings";
  import type { Result } from "$lib/types/utils";
  import Input from "../input/Input.svelte";
  import RadioButtonGroup from "../input/RadioButtonGroup.svelte";
  import { applyBackgroundColor } from "../../data/colors/contrast";
  import { isHex } from "$lib/data/colors/validation";
  import { toHex, toHSV } from "$lib/data/colors/conversion";

  let {
    color = $bindable(), 
    noThemeColors = false, 
  }:{
    color: ColorValue,
    noThemeColors?: boolean,
  } = $props();

  const tabs = ["Theme", "HSV"]
  let selectedTab = $state(tabs[0]!)

  function validateHex(draft: string): Result<HexColor>{
    if(isHex(draft)) return {status: "ok", data: draft}
    else return {status: "error", error: /*TODO: improve*/ "Invalid hexcode"}
  }

  let storedHSV: HSV = $state({...toHSV(color)});
  const currentHSV = $derived(toHex({type: "HSV", value: storedHSV}) === toHex(color) ? storedHSV : toHSV(color));
  
  function hsvBinding(key: "h" | "s" | "v"){
    return ({
      get: ()=>currentHSV[key],
      set: (value: number)=>{
        storedHSV = {...currentHSV, [key]: value};
        color = {type: "HSV", value: storedHSV};
      }
    });
  }

  const hBind = hsvBinding("h");
  const sBind = hsvBinding("s");
  const vBind = hsvBinding("v");

</script>

<div class="box" style={applyBackgroundColor({type: "SystemColor", value: "gray0"})}>
  {#if !noThemeColors}
    <RadioButtonGroup options={tabs} bind:value={selectedTab}/>
  {/if}

  {#if selectedTab === "Theme" && !noThemeColors}
    <div></div>
  {/if}
  {#if selectedTab === "HSV" || noThemeColors}
    <div class="swatchBox" style={applyBackgroundColor(color)}>
      <div class="hexInputWrapper">
        <Input
          maxlength={7}
          size={7}
          bind:value={
            ()=>toHex(color),
            (value)=>{color = {type: "HexColor", value}}
          } 
          validate={validateHex} 
          noInvalidBox
        />
      </div>
    </div>
    <div class="inputRow">
      <span>H</span>
      <input 
        type="range" 
        bind:value={hBind.get, hBind.set}
        min="0"
        max="360"
      >
      <input 
        type="number" 
        bind:value={hBind.get, hBind.set}
        min="0"
        max="360"
      >
    </div>
    <div class="inputRow">
      <span>S</span>
      <input 
        type="range" 
        bind:value={sBind.get, sBind.set}
        step="0.01"
        min="0"
        max="1"
      > 
      <input 
        type="number" 
        bind:value={sBind.get, sBind.set}
        step="0.01"
        min="0"
        max="1"
      >
    </div>
    <div class="inputRow">
      <span>V</span>
      <input 
        type="range" 
        bind:value={vBind.get, vBind.set}
        step="0.01"
        min="0"
        max="1"
      > 
      <input 
        type="number" 
        bind:value={vBind.get, vBind.set}
        step="0.01"
        min="0"
        max="1"
      >
    </div>
  {/if}
</div>

<style>
  .box{
    font-size: var(--standardText);
  }
  .swatchBox{
    position: relative;
    margin-bottom: var(--standardPadding);
    width: 100%;
    aspect-ratio: 3;
  }
  .hexInputWrapper{
    padding: var(--standardPadding);
    font-family: var(--monoFontFamily);
    position: absolute;;
    bottom: 0px;
  }
  .inputRow{
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
  }
  input[type="range"]{
    margin: 0 var(--standardPadding);
  }
  input[type="number"]{
    width: calc(var(--standardText) * 4);
  }
</style>