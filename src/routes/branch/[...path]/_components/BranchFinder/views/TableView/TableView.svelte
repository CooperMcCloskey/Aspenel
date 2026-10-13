<script lang="ts" generics="T extends PropertyType">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import IconBase from "$lib/components/icons/IconBase.svelte";
  import { createContextMenu } from "$lib/logic/contextMenus"; 
  import { branchHref } from "$lib/logic/filesystem";
  import { branchEditMenu } from "$lib/data/branch/menus/contextMenus";
  import { newChild } from "$lib/data/branch/commands";
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
  import type { Id, TableViewData } from "$lib/bindings";
  import PropertyValueContainer from "./PropertyValues/PropertyValueContainer.svelte";
  import MenuContainer from "$lib/components/MenuContainer.svelte";
  import { propertySchemaConfigMenuMap, type PropertySchemaConfigMenu } from "$lib/data/property/schema/menus/configMenus/map";
  import { editPropertySchemaMenu, newPropertySchemaMenu } from "$lib/data/property/schema/menus/contextMenus";
  import type { PropertyType } from "$lib/data/property/types";
  import type{ LoadedPropertySchema } from "$lib/data/property/schema/types";

  const { id, viewData }: { id: Id, viewData: TableViewData} = $props();

  $effect(()=>{
    viewData;
    stateManager.rootNodeHandle.loadChildren();
  })

  const children = $derived(stateManager.rootNodeHandle.childArray)
  const visiblePropertySchemas: LoadedPropertySchema<PropertyType>[] = $derived(
    Object.entries(stateManager.rootBranch.properties)
      .filter(([id, _])=>!viewData.hidden_property_ids.includes(id))
      .map(([id,p])=>({...p, id}))
  ); //TODO: Sort

</script>

<!-- TODO: Resizeable columns -->
<table class="container">

  <thead>
    <tr>
      <th class="startCell">Branch</th>
      
      {#each visiblePropertySchemas as propertySchema}
        <MenuContainer type="Component" menu={propertySchemaConfigMenuMap[propertySchema.type] as PropertySchemaConfigMenu<T>} menuProps={{schema: propertySchema as LoadedPropertySchema<T>}}>
          {#snippet children(menuTrigger, menuSnippet)}
            <th 
              role="button" 
              style="cursor: pointer"
              use:menuTrigger
              oncontextmenu={(e)=>createContextMenu(e, editPropertySchemaMenu(e.currentTarget, id, propertySchema.id))}
            >
              {propertySchema.name}
              {@render menuSnippet()}
            </th>
          {/snippet}
          
        </MenuContainer>
      {/each}

      <th class="endCell">
        <button onclick={(e)=>createContextMenu(e, newPropertySchemaMenu())}>
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

        {#each visiblePropertySchemas as propertySchema}
          <td class="propertyValueCell" style="padding: 0px">
            <PropertyValueContainer {propertySchema} id={child.id} />
          </td>
        {/each}

        <td class="endCell"><!--Empty cell to account for the add property button--></td>
      </tr>
    {/each}
  </tbody>

  <tfoot>
    <tr>
      <td class="startCell"><button onclick={()=>newChild()}><IconBase hasHoverEffect={true}><AddIcon/></IconBase></button></td>

      {#each visiblePropertySchemas}
        <td></td>
      {/each}

      <td class="endCell"></td>
    </tr>
  </tfoot>
</table>

<style>
  .container{
    height: 100%;
    font-family: var(--monoFontFamily);
    border-collapse: collapse;
  }
  th, td{
    position: relative;
    padding: var(--standardPadding);
    text-align: left;
    font-weight: normal;
    border: var(--borderWidth) solid var(--gray1);
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