<script lang="ts" generics="T extends PropertyType">
  import type { Id } from '$lib/bindings';
  import type { TypedPropertySchema } from '$lib/data/property/schema/types';
  import type { PropertyType } from '$lib/data/property/types';
  import { getLoadedProperty } from '$lib/data/property/value/data';
  import type { PropertyValueValidationResult, LoadedPropertyValue } from '$lib/data/property/value/types';
  import { propertyValueComponentMap, type PropertyValueComponent } from './map';

  const { 
    propertySchema, 
    childId
  }: { 
    propertySchema: TypedPropertySchema<T>,
    childId: Id
  } = $props();

  const property: LoadedPropertyValue<T> = $derived(getLoadedProperty<T>(propertySchema, [childId]));
  const PropertyValue: PropertyValueComponent<T> = $derived(propertyValueComponentMap[propertySchema.type]);
  let checkResult: PropertyValueValidationResult<T> = $state({status:"ok", data: undefined});
</script>

<div 
  class={checkResult.status === "ok" ? "valid" : "invalid"}
  class:text={propertySchema.type === "Number" || propertySchema.type === 'Text'}
>
  <PropertyValue {property} bind:checkResult/>
</div>

{#if checkResult.status === "error"}
  <div id="errorBox">{checkResult.error}</div>
{/if}

<style>
  .text{
    padding: var(--standardPadding);
  }
  #errorBox{
    display: none;
    position: absolute;
    top: calc(100% - var(--standardPadding));
    width: calc(100% - 2 * var(--standardPadding));
    max-height: calc(2 * var(--smallText) * var(--lineHeight) + 2 * var(--standardPadding));
    background-color: var(--red);
    color: var(--gray0);
    padding: var(--standardPadding);
    z-index: 1;
  }
  .invalid{ box-shadow: inset 0 0 0 calc(var(--standardPadding) - var(--borderWidth)) var(--red); }
  .invalid:focus-within + #errorBox { display: block; }
</style>
