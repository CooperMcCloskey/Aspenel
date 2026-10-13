<script lang="ts">
  import type { HexColor } from "$lib/bindings";
  import MenuContainer from "../MenuContainer.svelte";
  import ColorPickerMenu from "./ColorPickerMenu.svelte";
  import { applyBackgroundColor } from "./data";

  let { hexValue = $bindable() }:{ hexValue: HexColor } = $props();

</script>

<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <button 
      use:menuTrigger 
      aria-label="Color picker"
      style={applyBackgroundColor({type: "HexColor", value: hexValue})}
    ></button>
    {@render menuSnippet()}
  {/snippet}

  {#snippet menu()}
    <ColorPickerMenu bind:hexValue></ColorPickerMenu>
  {/snippet}
</MenuContainer>

<style>
  button{
    height: var(--smallText);
    width: var(--smallText);
  }
</style>