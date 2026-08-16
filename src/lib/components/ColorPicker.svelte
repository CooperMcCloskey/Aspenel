<script lang="ts">
  import MenuContainer from "./MenuContainer.svelte";

  let {value = $bindable("#FF007F"), noThemeColors = false} = $props();
</script>

<MenuContainer type="Snippet">
  {#snippet children(menuTrigger, menuSnippet)}
    <button use:menuTrigger aria-label="Color Picker"></button>
    {@render menuSnippet()}
  {/snippet}

  {#snippet menu()}
    <div id="box">
      <div id="tabs"></div>
    </div>
  {/snippet}
</MenuContainer>

<style>
  button{
    height: var(--smallText);
    width: var(--smallText);
    background-color: var(--red);
  }
  #box{
    width: 100px;
    height: 100px;
  }
</style>