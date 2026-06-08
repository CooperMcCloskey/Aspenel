<script lang="ts">
  import { createContextMenu } from "$lib/contextMenus/rightClickHandler";
  import { createViewMenu } from "../menus";

  
</script>

<button onclick={(e)=>{createContextMenu(e, createViewMenu())}}>Add sub-branches</button>

<style>
  button{
    color: var(--gray);
  }
  button:hover{
    color: var(--black)
  }
</style>