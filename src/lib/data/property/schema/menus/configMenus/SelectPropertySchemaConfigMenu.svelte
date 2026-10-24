<script lang="ts">
  import type { Id, SelectOption } from "$lib/bindings";
  import ColorPicker from "$lib/components/colors/ColorPicker.svelte";
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import Input from "$lib/components/input/Input.svelte";
  import { applySelectOptionCommand, newSelectOption } from "$lib/data/property/value/variants/select";
  import type { LoadedPropertySchema } from "../../types";

  const { schema }: { schema: LoadedPropertySchema<"Select"> } = $props();

  const options: (SelectOption & {id: Id})[] = $derived(
    Object
      .entries(schema.options)
      .map(([id, o])=>({...o, id}))
  )
</script>

<div>
  {#each options as option}
    <div class="row">
      <ColorPicker bind:color={
        ()=>{return option.color},
        (v)=>{applySelectOptionCommand(option.id, schema.id, (option)=>{option.color = v})}
      }></ColorPicker>
      <Input 
        value={option.name}
        preventInvalidInput
        noInvalidBox
        submit={(v)=>applySelectOptionCommand(option.id, schema.id, (option)=>{option.name = v})}
      />
    </div>
  {/each}
  <div class="row">
    <button onclick={()=>{newSelectOption(options.length, schema.id)}}>
      <IconBase hasHoverEffect={true}><AddIcon/></IconBase>
    </button>
  </div>
</div>

<style>
  .row{
    position: relative;
    white-space: nowrap;
  }
</style>