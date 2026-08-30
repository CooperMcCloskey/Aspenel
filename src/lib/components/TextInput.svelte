<script lang="ts" generics="T">
  import type { Result } from '$lib/types/utils';

  let {
    validate,
    invalidStyle = "text",
    noInvalidBox = true,
    value = $bindable(),
    onSubmit,
  }:{
    validate: (draft: string)=>Result<T>,
    invalidStyle?: "text" | "outline",
    noInvalidBox?: boolean
    value: T
    onSubmit?: (value: T)=>void; 
  }= $props();

  let draft: string = $state($state.snapshot(String(value)));
  $effect(()=>{draft = String(value)})

  let validation = $derived(validate(draft))
  let valid: boolean = $derived(validation.status === "ok");
</script>

<div class="container">
  <input
    type="text"
    spellcheck="false"
    autocorrect="off"
    autocomplete="off"
    autocapitalize="off"
    bind:value={draft}
    class:invalid={!valid}
    class:invalidOutline={invalidStyle==="outline"}
    class:invalidText={invalidStyle==="text"}
    onchange={()=>{
      const result = validate(draft);
      if(result.status === "ok") value = result.data;
    }}
    onkeypress={(e)=>{
      if(e.key==="Enter") {
        e.preventDefault()
        e.currentTarget.blur();
      }
      if(e.key==="Escape") {
        e.preventDefault();
        draft = String(value); 
        e.currentTarget.blur();
      }
    }}
    onblur={()=>{
      const result = validate(draft);
      if(result.status === "ok"){ value = result.data }
      else{ draft = String(value) }
      if(onSubmit) onSubmit(value);
    }}
  >
  {#if validation.status === "error" && !noInvalidBox}
    <div id="noInvalidBox">{validation.error}</div>
  {/if}
</div>

<style>
  #noInvalidBox{
    position: absolute;
    display: none;
    left: 0;
    top: calc(100% - var(--standardPadding));
    max-height: calc(2 * var(--smallText) * var(--lineHeight) + 2 * var(--standardPadding));
    background-color: var(--red);
    color: var(--gray0);
    padding: var(--standardPadding);
    z-index: 1;
  }
  .invalid:focus-within + #noInvalidBox { display: block; }
  .invalid.invalidOutline{ box-shadow: inset 0 0 0 calc(var(--standardPadding) - var(--borderWidth)) var(--red); }
  .invalid.invalidText{ color: var(--red) }
</style>