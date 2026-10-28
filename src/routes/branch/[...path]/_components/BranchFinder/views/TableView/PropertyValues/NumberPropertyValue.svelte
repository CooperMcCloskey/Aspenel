<script lang="ts">
  import Input from "$lib/components/input/Input.svelte";
  import { setPropertyValue } from "$lib/data/property/value/commands";
  import type { PropertyValueValidationResult, LoadedPropertyValue } from "$lib/data/property/value/types";
  import { checkNumberValue } from "$lib/data/property/value/variants/number";

  let {
    property,
    checkResult = $bindable()
  }: {
    property: LoadedPropertyValue<"Number">
    checkResult: PropertyValueValidationResult<"Number">
  } = $props();

</script>


<Input
  bind:value={property.value}
  validate={(draft)=>checkNumberValue(property.schema, draft)}
  format={(value)=>(value === undefined ? "" : String(value))}
  submit={(value)=>setPropertyValue(property, value)}
  --text-align="right"
  --invalidBox-left="calc(-1 * var(--standard-padding))"
  --invalidBox-top="calc(100% + var(--standard-padding) + var(--border-width))"
>
</Input>
