<script lang="ts">
  import type { ColorValue, HexColor } from "$lib/bindings";
  import MenuContainer from "../MenuContainer.svelte";
  import ColorPickerMenu from "./ColorPickerMenu.svelte";
  import { applyBackgroundColor } from "../../data/colors/contrast";

  let { color = $bindable() }:{ color: ColorValue } = $props();

</script>

<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <button 
      use:menuTrigger 
      aria-label="Color picker"
      style={applyBackgroundColor(color)}
    ></button>
    {@render menuSnippet()}
  {/snippet}

  {#snippet menu()}
    <ColorPickerMenu bind:color></ColorPickerMenu>
  {/snippet}
</MenuContainer>

<style>
  button{
    height: var(--smallText);
    width: var(--smallText);
  }
</style>