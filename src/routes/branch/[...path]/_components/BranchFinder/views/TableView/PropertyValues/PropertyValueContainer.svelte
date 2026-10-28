<script lang="ts" generics="T extends PropertyType">
  import type { Id } from '$lib/bindings';
  import type { LoadedPropertySchema } from '$lib/data/property/schema/types';
  import type { PropertyType } from '$lib/data/property/types';
  import { getLoadedProperty } from '$lib/data/property/value/data';
  import type { PropertyValueValidationResult, LoadedPropertyValue } from '$lib/data/property/value/types';
  import { propertyValueComponentMap, type PropertyValueComponent } from './map';

  const { 
    propertySchema, 
    id: id
  }: { 
    propertySchema: LoadedPropertySchema<T>,
    id: Id
  } = $props();

  const property: LoadedPropertyValue<T> = $derived(getLoadedProperty<T>(propertySchema, [id]));
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
  <div class="errorBox">{checkResult.error}</div>
{/if}

<style>
  .text{
    padding: var(--standard-padding);
  }
  .errorBox{
    display: none;
    position: absolute;
    top: calc(100% - var(--standard-padding));
    width: calc(100% - 2 * var(--standard-padding));
    max-height: calc(2 * var(--small-text) * var(--line-height) + 2 * var(--standard-padding));
    background-color: var(--red);
    color: var(--gray0);
    padding: var(--standard-padding);
    z-index: 1;
  }
  .invalid{ box-shadow: inset 0 0 0 calc(var(--standard-padding) - var(--border-width)) var(--red); }
  .invalid:focus-within + .errorBox { display: block; }
</style>
