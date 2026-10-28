<script lang="ts" generics="T extends string, U extends T">
  import { systemStringToDisplay } from "$lib/data/utils";

  let {
    value = $bindable(),
    options,
  }:{
    value: T
    options: U[],
  } = $props();

  const id = $props.id()
</script>

<div class="tabs">
  {#each options as option}
    <label class="tab">
      <input 
        type="radio" 
        name="tabs-{id}" 
        value={option}
        bind:group={value}
      >
      <span class="tabLabel">{systemStringToDisplay(option)}</span>
    </label>
  {/each}
</div>

<style>
  .tabs {
    padding: var(--standard-padding);
    display: inline-flex;
    gap: var(--tabs-gap, var(--standard-padding));
    justify-content: var(--justify-content, flex-start);
    flex-direction: var(--flex-direction, row);
    align-items: var(--align-items, start);
  }
  .tabLabel {
    display: inline-block;
    padding: var(--standard-padding);
  }
  .tab{
    position: relative;
  }
  .tab:first-child{
    left: var(--first-child-padding, calc(-1 * var(--standard-padding)));
  }
  .tab input:checked + .tabLabel {
    background: var(--gray3);
    color: var(--gray0);
  }
</style>