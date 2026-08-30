<script lang="ts">
  import { setPropertyValue } from "$lib/data/property/value/commands";
  import type { PropertyValueValidationResult, LoadedPropertyValue } from "$lib/data/property/value/types";
  import { checkNumberValue } from "$lib/data/property/value/variants/number";
  import { onCommit } from "$lib/logic/actions";

  let {
    property,
    checkResult = $bindable()
  }: {
    property: LoadedPropertyValue<"Number">
    checkResult: PropertyValueValidationResult<"Number">
  } = $props();

  $inspect(property)
 
  function setValue(value: unknown){
    checkResult = setPropertyValue(property, value);
    if(checkResult.status === "error"){
      checkResult = setPropertyValue(property, property.value);
      if(checkResult.status === "error") throw new Error("Illegal property value saved");
    }
  }

</script>

<!-- FIXME: operation being pushed on focus -->
<!-- TODO: replace with TextInput component -->
<input 
  value={property.value ?? ""} 
  use:onCommit={(e, el)=>setValue(el.value)} 
  oninput={(e)=>{checkResult = checkNumberValue(property.schema, e.currentTarget.value)}}
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