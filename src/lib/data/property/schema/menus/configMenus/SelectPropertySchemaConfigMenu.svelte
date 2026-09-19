<script lang="ts">
  import ColorPicker from "$lib/components/colors/ColorPicker.svelte";
  import type { LoadedPropertySchema } from "../../types";

  const { schema }: { schema: LoadedPropertySchema<"Select"> } = $props();
</script>

<div>
  <div class="row"><ColorPicker></ColorPicker> <span>lorem</span></div>
  <div class="row"><ColorPicker></ColorPicker> <span>ipsum</span></div>
  <div class="row"><ColorPicker></ColorPicker> <span>dolor sit amet</span></div>
</div>

<style>
  .row{
    position: relative;
    white-space: nowrap;
  }
</style>