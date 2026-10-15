<script lang="ts">
    import type { ColorValue, HexColor } from "$lib/bindings";
  import MenuContainer from "../MenuContainer.svelte";
  import ColorPickerMenu from "./ColorPickerMenu.svelte";

  let { color = $bindable(), name }:{ color: ColorValue, name: string } = $props();
</script>

<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <button
      use:menuTrigger
      aria-label="Color picker"
      style="background-color: {color};"
    >
      <span class="name">{name}</span>
      <span class="hex">{color}</span>
    </button>
    {@render menuSnippet()}
  {/snippet}

  {#snippet menu()}
    <ColorPickerMenu 
      bind:color
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
  .name{
    position: absolute;
    top: var(--standardPadding);
    left: var(--standardPadding);
    font-family: var(--fontFamily);
  }
  .hex{
    position: absolute;
    bottom: var(--standardPadding);
    left: var(--standardPadding);
    font-family: var(--monoFontFamily);
  }
</style>

