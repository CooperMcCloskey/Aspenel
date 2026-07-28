<script lang="ts" generics="T extends PropertyType">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import { editPropertyMenu, newPropertyMenu } from "../../properties/menus";
  import { createContextMenu } from "$lib/logic/contextMenus"; 
  import { branchHref } from "$lib/logic/filesystem";
  import { branchEditMenu } from "../menus";
  import { newChild } from "../../operations";
  import type { PropertyType } from "$lib/data/property/types";
  import { type PropertyValueComponent, propertyValueComponentMap } from "../../properties/types";
  import { getLoadedProperty } from "$lib/data/property/value/data";
  import { stateManager } from "$lib/logic/state.svelte";
    import type { TableViewData } from "$lib/bindings";
  const { viewData }: { viewData:  TableViewData} = $props();
  $effect(()=>{
    viewData;
    stateManager.loadChildren();
  })

  const children = $derived(stateManager.activeChildren)
  const visibleProperties = $derived(Object.values(stateManager.rootBranch.properties).filter((p)=>!viewData.hidden_property_ids.includes(p.id)))

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
          oncontextmenu={(e)=>createContextMenu(e, editPropertyMenu(e.currentTarget, {type: "Table", ...viewData}, property.id))}
        >
          {property.name}
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
    {#each children as child}
      <tr>
        <td class="startCell">
          <a
            oncontextmenu={(e)=>createContextMenu(e, branchEditMenu([child.id]))} 
            href={branchHref(child.path)}
          >
            {child.filename}
          </a>
        </td>

        {#each visibleProperties as property}
          {@const PropertyValue: PropertyValueComponent<T> = propertyValueComponentMap[property.type as T]} <!-- T is not fixed. It is cast to the given property type as needed -->
            
          <td style="padding: 0px">
            <PropertyValue propertyData={getLoadedProperty<T>(property, [child.id])}></PropertyValue>
          </td>
        {/each}

        <td class="endCell"><!--Empty cell to account for the add property button--></td>
      </tr>
    {/each}
  </tbody>

  <tfoot>
    <tr>
      <td class="startCell"><button onclick={()=>newChild()}><IconBase hasHoverEffect={true}><AddIcon/></IconBase></button></td>

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
    -webkit-user-select: none; /* Necessary for mac right now but maybe there is a better choice? */
  }
  tfoot > tr > td{ border-bottom: none; } 
  .startCell{ border-left: none; }
  .endCell{ border-right: none; }
</style>