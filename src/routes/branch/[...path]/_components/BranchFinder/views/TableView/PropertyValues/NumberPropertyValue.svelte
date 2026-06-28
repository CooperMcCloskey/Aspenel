<script lang="ts">
  import { onCommit } from "$lib/utils/actions";
  import { checkNumberValue } from "../../../properties/data";
  import { updatePropertyValue } from "../../../properties/operations";
  import type { LoadedProperty } from "../../../properties/types";

  let {propertyData}: {propertyData: LoadedProperty<"Number">} = $props();

  let validInput = $state(true);

  function updateValue(e: FocusEvent, el: HTMLElement){
    let input = el as HTMLInputElement
    try{ 
      propertyData.value = checkNumberValue(propertyData.schema, input.value);
      updatePropertyValue(propertyData);
    }
    catch{ input.value = `${propertyData.value ?? ""}` }
    validInput = true;
  }

  function checkInputValue(e: {currentTarget: HTMLInputElement}){
    const input = e.currentTarget;
    try {
      checkNumberValue(propertyData.schema, input.value);
      validInput = true;
    }
    catch{ validInput = false; }
  }

</script>

<div>
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