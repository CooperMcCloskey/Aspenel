<script lang="ts">
    import ColorPicker from "$lib/components/colors/ColorPicker.svelte";
    import type { TypedPropertySchema } from "../../types";

  const { schema }: { schema: TypedPropertySchema<"Select"> } = $props();
</script>

<div>
  <div class="row"><ColorPicker></ColorPicker> <span>lorem</span></div>
  <div class="row"><ColorPicker></ColorPicker> <span>ipsum</span></div>
  <div class="row"><ColorPicker></ColorPicker> <span>dolor sit amet</span></div>
</div>

<style>
  .row{
    position: relative;
    gray0-space: nowrap;
  }
</style>