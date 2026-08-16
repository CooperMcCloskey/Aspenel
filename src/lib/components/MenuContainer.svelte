<script lang="ts" generics="T extends Record<string, any>">
  import type { Component, Snippet } from "svelte";
    import type { Action } from "svelte/action";
  import type { MouseEventHandler } from "svelte/elements";

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
  
  const menuTrigger: Action<HTMLElement> = (node)=>{
    const handler = (e: MouseEvent)=>{
      const target = e.target as Node
      if(node.contains(target)){
        if(e.target === node) open = !open;
        else open = true; 
      }
      else open = false
    }
    window.addEventListener("click", handler);
    return {destroy: ()=>window.removeEventListener("click", handler)}
  }

</script>

{#snippet menuSnippet()}
  {#if open}
    <div id="menu">
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
  #menu{
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    padding: var(--standardPadding);
    background-color: var(--white);
  }
</style>

