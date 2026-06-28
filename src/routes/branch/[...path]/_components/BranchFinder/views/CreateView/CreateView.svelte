<script lang="ts">
  import { createContextMenu } from "$lib/utils/contextMenus";
  import { createViewMenu } from "../menus";

  
</script>

<button onclick={(e)=>{createContextMenu(e, createViewMenu())}}>Add View</button>

<style>
  button{
    color: var(--gray);
  }
  button:hover{
    color: var(--black)
  }
</style>