<script lang="ts">
  import type { PropertyValueValidationResult, LoadedPropertyValue } from "$lib/data/property/value/types";

  let {
    propertyData,
    checkResult = $bindable()
  }: {
    propertyData: LoadedPropertyValue<"Select">
    checkResult: PropertyValueValidationResult<"Select">
  } = $props();

</script>

<select>
  <option selected>   </option>
</select>

<style>
  select{
    width: 100%;
    height: 100%;
    padding: var(--standardPadding);
  }
</style>