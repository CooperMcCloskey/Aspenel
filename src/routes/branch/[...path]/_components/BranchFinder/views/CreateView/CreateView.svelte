<script lang="ts">
  import { createContextMenu } from "$lib/logic/contextMenus";
    import { createViewMenu } from "$lib/data/modules/branchView/menus/contextMenus";
</script>

<button onclick={(e)=>{createContextMenu(e, createViewMenu())}}>Add View</button>

<style>
  button{
    color: var(--gray2);
  }
  button:hover{
    color: var(--gray4)
  }
</style>