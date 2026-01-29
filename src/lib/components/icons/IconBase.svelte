<script lang="ts">
  export let color: string= "var(--black)";
  export let size: string = "24px";
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={size} width={size} fill={color}>
  <slot></slot>
</svg>