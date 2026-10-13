<script lang="ts">
  import type { Id, SelectOption } from "$lib/bindings";
    import ColorPicker from "$lib/components/colors/ColorPicker.svelte";
    import AddIcon from "$lib/components/icons/AddIcon.svelte";
    import IconBase from "$lib/components/icons/IconBase.svelte";
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
      <!-- <ColorPicker bind:hexValue={
        ()=>{},
        (v)=>{}
      }></ColorPicker> -->
      <span class="optionLabel">{option.name}</span>
    </div>
  {/each}
  <div class="row">
    <button onclick={()=>{}}>
      <IconBase hasHoverEffect={true}><AddIcon/></IconBase>
    </button>
  </div>
</div>

<style>
  .row{
    position: relative;
    white-space: nowrap;
  }
  .optionLabel{
    text-overflow: ellipsis;
  }
</style>