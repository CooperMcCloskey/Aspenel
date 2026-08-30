<script lang="ts">
    import type { HexColor } from "$lib/bindings";
  import MenuContainer from "../MenuContainer.svelte";
  import ColorPickerMenu from "./ColorPickerMenu.svelte";

  let { hexValue = $bindable(), name }:{ hexValue: HexColor, name: string } = $props();
</script>

<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <button
      use:menuTrigger
      aria-label="Color picker"
      style="background-color: {hexValue};"
    >
      <span id="name">{name}</span>
      <span id="hex">{hexValue}</span>
    </button>
    {@render menuSnippet()}
  {/snippet}

  {#snippet menu()}
    <ColorPickerMenu 
      bind:hexValue
      noThemeColors
    />
  {/snippet}
</MenuContainer>

<style>
  button{
    position: relative;
    width: 100%;
    height: 100%;
  }
  #name{
    position: absolute;
    top: var(--standardPadding);
    left: var(--standardPadding);
    font-family: var(--fontFamily);
  }
  #hex{
    position: absolute;
    bottom: var(--standardPadding);
    left: var(--standardPadding);
    font-family: var(--monoFontFamily);
  }
</style>

