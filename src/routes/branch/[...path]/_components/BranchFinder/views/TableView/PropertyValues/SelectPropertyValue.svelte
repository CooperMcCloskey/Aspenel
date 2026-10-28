<script lang="ts">
  import type { PropertyValueValidationResult, LoadedPropertyValue } from "$lib/data/property/value/types";
  import { sortByTimeCreated } from "$lib/data/utils";

  let {
    propertyData,
    checkResult = $bindable()
  }: {
    propertyData: LoadedPropertyValue<"Select">
    checkResult: PropertyValueValidationResult<"Select">
  } = $props();

  const options = $derived(sortByTimeCreated(propertyData.schema.options));
</script>

<select>
  <option selected>   </option>
</select>

<style>
  select{
    width: 100%;
    height: 100%;
    padding: var(--standard-padding);
  }
</style>