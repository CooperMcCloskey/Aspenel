<script lang="ts">
  import { updatePropertyValue } from "$lib/data/property/value/operations";
  import type { CheckValueResult, LoadedPropertyValue } from "$lib/data/property/value/types";
  import { checkNumberValue } from "$lib/data/property/value/variants/number";
  import { onCommit } from "$lib/logic/actions";

  let {
    propertyData,
    checkResult = $bindable()
  }: {
    propertyData: LoadedPropertyValue<"Number">
    checkResult: CheckValueResult<"Number">
  } = $props();

  $effect(()=>{
    checkResult = checkNumberValue(propertyData.schema, propertyData.value)
  })

  // $inspect(propertyData.schema, propertyData.value)
 
  function updateValue(e: FocusEvent, input: HTMLInputElement){
    checkResult = checkNumberValue(propertyData.schema, input.value)
    if(checkResult.status === "ok") updatePropertyValue(propertyData, checkResult.data);
    else {
      input.value = `${propertyData.value ?? ""}`;
      checkResult = checkNumberValue(propertyData.schema, input.value)
    }  
  }

</script>

<!-- FIXME: operation being pushed on focus -->
<input 
  value={propertyData.value} 
  use:onCommit={updateValue} 
  oninput={(e)=>{checkResult = checkNumberValue(propertyData.schema, e.currentTarget.value)}}
  type="text"
  autocorrect="off"
  autocapitalize="off"
  autocomplete="off"
  spellcheck="false"
>

<style>
  input{ 
    text-align: right; 
  }
</style>