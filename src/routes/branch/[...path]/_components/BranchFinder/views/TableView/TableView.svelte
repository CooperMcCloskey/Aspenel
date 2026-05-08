<script lang="ts">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
	import type { BranchViewProps } from "../../../../_types/BranchViewTypes";
  import type { TableViewData } from "$lib/types/rustTypes/TableViewData";
	import type { Component } from "svelte";
  import { childFiledata, filedata } from "../../../../_logic/filedata.svelte";

  const {viewData}: BranchViewProps<TableViewData> = $props();
  //TODO: currently repeated; see if this can be shared across components for performaance
  const childFiledataArray = $derived(Object.values(childFiledata))

  const childPropertyMap = Object.fromEntries(filedata.branch.child_properties.map(p => [p.identifier.id, p]))
  const propertyValueComponentMap: Record<string, Component> = {
		
	}
</script>

<table id="container">
  <thead>
    <tr>
      <td><!--Blank top left corner--></td>
      {#each viewData.visible_property_ids as id}
        {@const property = childPropertyMap[id]}
        {#if property}
          <td>{property.identifier.name}</td>
        {/if}
      {/each}
      <td><button><IconBase hasHoverEffect={true}><AddIcon/></IconBase></button></td>
    </tr>
  </thead>
  
  <tbody>
    {#each childFiledataArray as child}
      <tr>
        <td>{child.filename}</td>
        {#each viewData.visible_property_ids as id}
          <td>{child.branch.property_values[id]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  #container{
    width: 100%;
    height: 100%;
  }
</style>