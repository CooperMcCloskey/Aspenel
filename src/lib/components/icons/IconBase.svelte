<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    size = "24px", 
    hasHoverEffect = false,
    color, 
    children
  }: {
    size?: string,
    hasHoverEffect?: boolean,
    color?: string,
    children: Snippet<[]>
  } = $props()

  const resolvedColor = $derived(color ?? (hasHoverEffect ? "var(--gray2)" : "var(--gray4)"))
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class:hover={hasHoverEffect} height={size} width={size} fill={resolvedColor}>
  {@render children()}
</svg>

<style>
  .hover:hover{
    /* Hover color should be passed as a style prop */
    fill: var(--hoverColor, var(--gray4))
  }
</style>