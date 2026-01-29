<script lang="ts">
  export let color: string= "var(--black)";
  export let hasHoverEffect: boolean= false
  export let size: string = "24px";

  console.log(hasHoverEffect)
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class:hover={hasHoverEffect} height={size} width={size} fill={hasHoverEffect ? "currentColor" : color}>
  <slot></slot>
</svg>

<style>
  .hover{
    transition: var(--fastTransition) color;
  }
  .hover:hover{
    /* Hover color should be passed as a style prop */
    color: var(--hoverColor)
  }
</style>