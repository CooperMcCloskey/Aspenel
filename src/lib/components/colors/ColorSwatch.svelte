<script lang="ts">
  import type { HexColor } from "$lib/bindings";
  import AdaptiveComponent from "$lib/logic/adaptiveRendering/AdaptiveComponent.svelte";
  import MenuContainer from "../MenuContainer.svelte";
  import ColorPickerMenu from "./ColorPickerMenu.svelte";
  import { applyBackgroundColor } from "./data";

  let { hexValue = $bindable(), name, schemeOverride }:{ hexValue: HexColor, name: string, schemeOverride?: boolean } = $props();

</script>


<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <div class="wrapper">
      <button
        use:menuTrigger
        aria-label="Color picker"
        style={applyBackgroundColor(hexValue, schemeOverride)}
      >
        <AdaptiveComponent> 
          {#snippet box()}
            <div class="textBox">
              <span class="name">{name}</span>
              <span class="hex">{hexValue}</span>
            </div>
          {/snippet}
          {#snippet fullLine()}
            <div class="textLine">
              <span class="name">{name}</span>
              <span class="hex">{hexValue}</span>
            </div>
          {/snippet}
          {#snippet nameLine()}
            <div class="textLine">
              <span class="name">{name}</span>
            </div>
          {/snippet}
          {#snippet empty()}
            <div></div>
          {/snippet}
        </AdaptiveComponent>
      </button>
      {@render menuSnippet()}
    </div>
  {/snippet}

  {#snippet menu()}
    <ColorPickerMenu 
      bind:hexValue
      noThemeColors
    />
  {/snippet}
</MenuContainer>

<style>
  .wrapper{
    position: relative;
    width: 100%;
    height: 100%;
  }
  button{
    position: relative;
    padding: var(--standardPadding);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .textBox{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .textBox > .hex{
    text-align: right;
  }
  .textLine{
    height: 100%;
    display: flex;
    justify-content: space-between;
    gap: calc(var(--standardPadding) * 2);
    align-items: center;
  }
  .name{
    font-family: var(--fontFamily);
  }
  .hex{
    font-family: var(--monoFontFamily);
  }
</style>

