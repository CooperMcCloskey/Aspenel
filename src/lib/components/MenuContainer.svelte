<script lang="ts" generics="T extends Record<string, any>">
  import type { Component, Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import { applyBackgroundColor } from "./colors/data";

  //TODO: click down inside the box and then unclick outside the box hides the menu
  //TODO: position the box where there is space so it is not off the screen

  type Props = { 
    children: Snippet<[
      menuTrigger: Action<HTMLElement>, 
      menuSnippet: Snippet,
    ]>
  } & (
    | {type: "Component", menu: Component<T>, menuProps: T} 
    | {type: "Snippet", menu: Snippet}
  ) 

  let props: Props = $props()
  let open: boolean = $state(false);

  let menuElement: HTMLElement | undefined = $state() //TODO: figure out why the menu closes on click for color picker 
  
  const menuTrigger: Action<HTMLElement> = (trigger)=>{
    const handler = (e: MouseEvent)=>{
      const target = e.target as Node
      if(trigger.contains(target)){
        if(e.target === trigger) open = !open;
        else open = true; 
      }
      else if(menuElement?.contains(target)) return
      else open = false
    }
    window.addEventListener("click", handler);
    return {destroy: ()=>window.removeEventListener("click", handler)}
  }

</script>

{#snippet menuSnippet()}
  {#if open}
    <div 
      class="menu" 
      bind:this={menuElement}
      style={applyBackgroundColor("gray0")}
    >
      {#if props.type === "Component"}
        <props.menu {...props.menuProps}/> 
      {:else} 
        {@render props.menu()} 
      {/if}
    </div>  
  {/if}
{/snippet}

{@render props.children(menuTrigger, menuSnippet)}

<style>
  .menu{
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    padding: var(--standardPadding);
  }
</style>

