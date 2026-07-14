<script lang="ts">
  import type { LoadedPropertyValue } from "$lib/data/property/value/types";
  import { checkNumberValue } from "$lib/data/property/value/variants/number";
  import { onCommit } from "$lib/logic/actions";
  import { updatePropertyValue } from "../../../properties/operations";;

  let {propertyData}: {propertyData: LoadedPropertyValue<"Number">} = $props();

  let validInput = $state(true);

  function updateValue(e: FocusEvent, el: HTMLElement){
    let input = el as HTMLInputElement
    try{ 
      propertyData.value = checkNumberValue(propertyData.schemaData, input.value);
      updatePropertyValue(propertyData);
    }
    catch{ input.value = `${propertyData.value ?? ""}` }
    validInput = true;
  }

  function checkInputValue(e: {currentTarget: HTMLInputElement}){
    const input = e.currentTarget;
    try {
      checkNumberValue(propertyData.schemaData, input.value);
      validInput = true;
    }
    catch (error) { console.error(error); validInput = false; }
  }

</script>

<div>
  <!-- FIXME: operation being pushed on focus -->
  <input 
    value={propertyData.value} 
    use:onCommit={updateValue} 
    class={validInput ? "valid" : "invalid"}
    oninput={checkInputValue}
    type="text"
  >
</div>

<style>
  input{ 
    text-align: right; 
    padding: var(--tablePadding);
  }
  .invalid:focus{ box-shadow: inset 0 0 0 calc(var(--tablePadding) - var(--borderWidth)) var(--red); }
</style>