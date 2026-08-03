<script lang="ts" generics="T extends Record<string, any>">
  import type { Component, Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";
  let { 
    Menu, 
    menuProps, 
    children 
  }: { 
    Menu: Component<T>, 
    menuProps: T, 
    children: Snippet<[
      setOpen: MouseEventHandler<HTMLTableCellElement>, 
      menuSnippet: Snippet,
    ]>,
  } = $props()
    
  let open: boolean = $state(false);
  
  function setOpen(e: MouseEvent & {currentTarget: HTMLTableCellElement}){ 
    e.stopPropagation(); 
    open = true; 
  }

</script>

<svelte:window onclick={()=>{open=false}} />

{#snippet menuSnippet()}
  {#if open}
    <div id="menu">
      <Menu {...menuProps}/>
    </div>  
  {/if}
{/snippet}

{@render children(setOpen, menuSnippet)}

<style>
  #menu{
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    padding: var(--standardPadding);
    background-color: var(--white);
  }
</style>

