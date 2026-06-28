<script lang="ts">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import type { TableViewData } from "$lib/types/rustTypes/TableViewData";
  import { childFiledata, filedata } from "../../../../_logic/filedata.svelte";
  import { editPropertyMenu, newPropertyMenu } from "../../properties/menus";
  import { createContextMenu } from "$lib/utils/contextMenus"; 
  import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
  import { branchHref } from "$lib/filesystem/utils";
  import { branchEditMenu } from "../menus";
  import { newBranch } from "../../operations";
  import { getLoadedProperty, getPropertyValueComponent } from "../../properties/data";
  import type { LoadedPropertyUnion } from "../../properties/types";

  const { viewData }: { viewData: TableViewData} = $props();

  //TODO: currently repeated; see if this can be shared across components for performaance)
  let childFiledataArray = $derived(Object.values(childFiledata))
  let visibleProperties: PropertySchema[] = $derived(
    filedata.branch.child_properties.filter((p)=>!viewData.hidden_property_ids.includes(p.identifier.id))
  )

</script>

<!-- TODO: Resizeable columns -->
<table id="container">

  <thead>
    <tr id="row1">
      <th class="startCell">Branch</th>
      
      {#each visibleProperties as property}
        <th 
          role="button" 
          onclick={()=>{}} 
          oncontextmenu={(e)=>createContextMenu(e, editPropertyMenu(e.currentTarget, property))}
        >
          {property.identifier.name}
        </th>
      {/each}

      <th class="endCell">
        <button onclick={(e)=>createContextMenu(e, newPropertyMenu())}>
          <IconBase hasHoverEffect={true}><AddIcon/></IconBase>
        </button>
      </th>
    </tr>
  </thead>
  
  <tbody>
    {#each childFiledataArray as child}
      <tr>
        <td class="startCell"><a oncontextmenu={(e)=>createContextMenu(e, branchEditMenu(child))} href={branchHref(child.path)}>{child.filename}</a></td>

        {#each visibleProperties as property}
          {@const PropertyValue = getPropertyValueComponent(property.type)}
          <td style="padding: 0px">
            <PropertyValue propertyData={getLoadedProperty(property.type, property, child.branch) as LoadedPropertyUnion}></PropertyValue> <!--Union cast is necessary because typescript can't correlate that the type of the component and the type of the data match-->
          </td>
        {/each}

        <td class="endCell"><!--Empty cell to account for the add property button--></td>
      </tr>
    {/each}
  </tbody>

  <tfoot>
    <tr>
      <td class="startCell"><button onclick={()=>newBranch(filedata.path)}><IconBase hasHoverEffect={true}><AddIcon/></IconBase></button></td>

      {#each visibleProperties}
        <td></td>
      {/each}

      <td class="endCell"></td>
    </tr>
  </tfoot>
</table>

<style>
  #container{
    height: 100%;
    font-family: var(--monoFontFamily);
    border-collapse: collapse;
  }
  th, td{
    padding: var(--tablePadding);
    text-align: left;
    font-weight: normal;
    border: var(--borderWidth) solid color-mix(in srgb, var(--gray) 25%, transparent);
  }
  th{ 
    border-top: none; 
    user-select: none;
    -webkit-user-select: none;
  }
  tfoot > tr > td{ border-bottom: none; } 
  .startCell{ border-left: none; }
  .endCell{ border-right: none; }
</style>