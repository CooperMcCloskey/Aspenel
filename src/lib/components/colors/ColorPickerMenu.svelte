<script lang="ts">
  import type { HexColor } from "$lib/bindings";
  import type { Result } from "$lib/types/utils";
    import Input from "../input/Input.svelte";
  import RadioButtonGroup from "../input/RadioButtonGroup.svelte";
  import { applyBackgroundColor, hexToHsv, hsvToHex, isHex } from "./data";

  let {
    hexValue = $bindable(), 
    noThemeColors = false, 
  }:{
    hexValue: HexColor,
    noThemeColors?: boolean,
  } = $props();

  const tabs = ["Theme", "HSV"]
  let selectedTab = $state(tabs[0]!)

  let hsv = $state(hexToHsv($state.snapshot(hexValue)))

  $effect(()=>{
    if(hsvToHex(hexToHsv(hexValue)) != hsvToHex(hsv) && isHex(hsvToHex(hsv))) hexValue = hsvToHex(hsv);
  })

  function validateHex(draft: string): Result<HexColor>{
    if(isHex(draft)) return {status: "ok", data: draft}
    else return {status: "error", error: /*TODO: improve*/ "Invalid hexcode"}
  }
</script>

<div class="box" style={applyBackgroundColor("gray0")}>
  {#if !noThemeColors}
    <RadioButtonGroup options={tabs} bind:value={selectedTab}/>
  {/if}

  {#if selectedTab === "Theme" && !noThemeColors}
    <div></div>
  {/if}
  {#if selectedTab === "HSV" || noThemeColors}
    <div class="swatchBox" style={applyBackgroundColor(hexValue)}>
      <div class="hexInputWrapper">
        <Input
          bind:value={hexValue} 
          validate={validateHex} 
          submit={(v)=>{hsv=hexToHsv(v)}}
          noInvalidBox
        />
      </div>
    </div>
    <div class="inputRow">
      <span>H</span>
      <input 
        type="range" 
        bind:value={hsv.h}
        min="0"
        max="360"
      >
      <input 
        type="number" 
        bind:value={hsv.h}
        min="0"
        max="360"
      >
    </div>
    <div class="inputRow">
      <span>S</span>
      <input 
        type="range" 
        bind:value={hsv.s}
        step="0.01"
        min="0"
        max="1"
      > 
      <input 
        type="number" 
        bind:value={hsv.s}
        step="0.01"
        min="0"
        max="1"
      >
    </div>
    <div class="inputRow">
      <span>V</span>
      <input 
        type="range" 
        bind:value={hsv.v}
        step="0.01"
        min="0"
        max="1"
      > 
      <input 
        type="number" 
        bind:value={hsv.v}
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
    position: absolute;
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