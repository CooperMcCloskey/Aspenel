<script lang="ts">
  import { createContextMenu } from "$lib/logic/contextMenus";
    import { createViewMenu } from "$lib/data/childView/menus/contextMenus";
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