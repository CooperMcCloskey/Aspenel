<script lang="ts" generics="T">
  import type { Result } from '$lib/types/utils';
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { ColorValue } from '$lib/bindings';
  import { applyBackgroundColor, applyErrorText } from '../../data/colors/contrast';
  import { systemColors } from "../../data/colors/utils";

  type Converters<T> = {
    format: (value: T) => string;
    validate: (draft: string) => Result<T>;
  }

  let {
    value = $bindable(),
    validate = (data: string)=>({status: "ok", data} as Result<T>),
    format = (value: T)=>value as string,
    invalidStyle = "text",
    preventInvalidInput = false,
    noInvalidBox = false,
    backgroundColor,
    submit,
    ...rest
  }:{
    value: T
    invalidStyle?: "text" | "outline",
    preventInvalidInput?: boolean
    noInvalidBox?: boolean
    backgroundColor?: ColorValue,
    submit?: (value: T)=>void; 
  }
  & ([T] extends [string] ? Partial<Converters<T>> : Converters<T>)
  & HTMLInputAttributes 
  = $props();

  // svelte-ignore state_referenced_locally
  let draft = $state(format(value));
  $effect(()=>{draft = format(value)})

  let validation = $derived(validate(draft))
  let valid: boolean = $derived(validation.status === "ok");
</script>

<div class="container" style={applyBackgroundColor(backgroundColor)}>
  <div class="highlightContainer" aria-hidden="true">
    <span 
      class="highlight" 
      {@attach applyErrorText(!valid && invalidStyle === "text")}
    >
      {draft}
    </span>
  </div>

  <input
    spellcheck="false"
    autocorrect="off"
    autocomplete="off"
    autocapitalize="off"
    inputmode={rest.type === "number" ? "decimal" : "text"}
    aria-invalid={!valid}
    bind:value={draft}
    class:invalid={!valid}
    class:invalidOutline={invalidStyle==="outline"}
    class:invalidText={invalidStyle==="text"}
    onkeydown={(e)=>{
      if(e.key==="Enter") {
        e.preventDefault()
        e.currentTarget.blur();
      }
      if(e.key==="Escape") {
        e.preventDefault();
        draft = format(value); 
        e.currentTarget.blur();
      }
    }}
    onblur={()=>{
      const result = validate(draft);
      if(result.status === "ok") {
        value = result.data;
        submit?.(value);
      }
      else draft = format(value);
    }}
    {...rest}
    type="text"
  >
  {#if validation.status === "error" && !noInvalidBox}
    <div 
      style={applyBackgroundColor(systemColors.red)} 
      class="invalidBox">{validation.error}
    </div>
  {/if}
</div>

<style>
  .container{
    display: inline-block;
    position: relative;
  }
  .highlightContainer{
    position: absolute;
    inset: 0;
    text-align: var(--text-align, left);
    font: inherit;
    font-size: var(--font-size);
    white-space: pre;
    pointer-events: none;
  }
  .highlight{
    color: transparent;
  }
  input{
    text-overflow: ellipsis;
    position: relative;
    background: transparent;
    text-align: var(--text-align, left);
    cursor: var(--cursor);
    font-size: var(--font-size);
  }
  .invalidBox{
    position: absolute;
    display: none;
    left: var(--invalidBox-left, 0);
    top: var(--invalidBox-top, 100%);
    color: var(--gray0);
    padding: var(--standardPadding);
    z-index: 1;
  }
  .invalid:focus-within + .invalidBox { display: block; }
  .invalid.invalidOutline{ box-shadow: inset 0 0 0 calc(var(--standardPadding) - var(--borderWidth)) var(--red); }
  .invalid.invalidText{ color: var(--red) !important }
</style>