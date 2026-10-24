<script lang="ts" generics="T extends Record<string, any>">
  import type { Component, Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import { applyBackgroundColor } from "../data/colors/contrast";

  //TODO: click down inside the box and then unclick outside the box hides the menu
  //TODO: position the box where there is space so it is not off the screen

  let props: { 
    children: Snippet<[
      menuTrigger: Action<HTMLElement>,
    ]>
  } & (
    | {type: "Component", menu: Component<T>, menuProps: T} 
    | {type: "Snippet", menu: Snippet}
  )  = $props()

  const id = $props.id();
  let position = $state({left: 0, top: 0});
  let trigger: HTMLElement | undefined;

  const menuTrigger: Action<HTMLElement> = (node)=>{
    trigger = node;
    node.setAttribute("popovertarget", id);
  }

  function placeMenu(e: ToggleEvent){
    if(e.newState !== "open" || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    position = {left: rect.left, top: rect.bottom};
  }

</script>

{@render props.children(menuTrigger)}

<div
  {id}
  popover
  class="menu"
  onbeforetoggle={placeMenu}
  style:left="{position.left}px"
  style:top="{position.top}px"
  style={applyBackgroundColor({type: "SystemColor", value: "gray0"})}
>
  {#if props.type === "Component"}
    <props.menu {...props.menuProps}/>
  {:else}
    {@render props.menu()}
  {/if}
</div>

<style>
  .menu{
    inset: auto;
    margin: 0;
    border: none;
    padding: var(--standardPadding);
    overflow: hidden;
  }
</style>

