<script lang="ts">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import type { TableViewData } from "$lib/types/rustTypes/TableViewData";
  import { childFiledata, filedata } from "../../../../_logic/filedata.svelte";
  import NumberPropertyValue from "./PropertyValues/NumberPropertyValue.svelte";
  import TextPropertyValue from "./PropertyValues/TextPropertyValue.svelte";
  import DatePropertyValue from "./PropertyValues/DatePropertyValue.svelte";
  import MultiSelectPropertyValue from "./PropertyValues/MultiSelectPropertyValue.svelte";
  import SelectPropertyValue from "./PropertyValues/SelectPropertyValue.svelte";
  import type { PropertyValueComponent } from "../../properties/types";
  import { newPropertyMenu } from "../../properties/menus";
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import type { Component } from "svelte";
  import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";

  const { viewData }: { viewData: TableViewData} = $props();

  //TODO: currently repeated; see if this can be shared across components for performaance)
  let childFiledataArray = $derived(Object.values(childFiledata))
  let visibleProperties: PropertySchema[] = $derived(
    filedata.branch.child_properties.filter((p)=>!viewData.hidden_property_ids.includes(p.identifier.id))
  )
  
  const childPropertyMap = Object.fromEntries(filedata.branch.child_properties.map(p => [p.identifier.id, p]))
  const propertyValueComponentMap: PropertyValueComponent = {
		Number: NumberPropertyValue,
    Text: TextPropertyValue,
    Date: DatePropertyValue,
    MultiSelect: MultiSelectPropertyValue,
    Select: SelectPropertyValue
	}

</script>

<table id="container">
  <thead>
    <tr id="row1">
      <th><!--Blank top left corner--></th>
      {#each visibleProperties as property}
        <th>{property.identifier.name}</th>
      {/each}
      <th><button onclick={(e)=>createContextMenu(e, newPropertyMenu())}><IconBase hasHoverEffect={true}><AddIcon/></IconBase></button></th>
    </tr>
  </thead>
  
  <tbody>
    {#each childFiledataArray as child}
      <tr>
        <td>{child.filename}</td>
        {#each visibleProperties as property}
          {@const PropertyValue = propertyValueComponentMap[property.type] as Component<any>} <!--TODO: Potentially get rid of Component<any> in the future-->
          <td><PropertyValue value={child.branch.property_values[property.identifier.id]}></PropertyValue></td>
        {/each}
        <td><!--Empty cell to account for the add property button--></td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  #container{
    height: 100%;
    border-collapse: collapse;
  }
</style>