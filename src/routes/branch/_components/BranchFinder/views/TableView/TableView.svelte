<script lang="ts">
  import type { BranchViewProps } from "$lib/types/branchViews/BranchViewProps";
  import type { TableViewData } from "$lib/types/rustTypes/TableViewData";
  const {children, viewData}: BranchViewProps<TableViewData> = $props();
</script>

<table id="container">
  <thead></thead>
  
</table>

<style>
  #container{
    width: 100%;
    height: 100%;
  }
</style>