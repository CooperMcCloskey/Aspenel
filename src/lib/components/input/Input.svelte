<script lang="ts" generics="T">
  import type { Result } from '$lib/types/utils';
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { ColorValue } from '$lib/bindings';
  import { applyBackgroundColor } from '../colors/data';

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
    submit: submit,
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

<div class="container">
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
    style={applyBackgroundColor(backgroundColor)}
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
    <div class="invalidBox">{validation.error}</div>
  {/if}
</div>

<style>
  .container{
    display: inline-block;
    position: relative;
  }
  input{
    text-align: var(--text-align, left);
    cursor: var(--cursor);
    font-size: var(--font-size);
  }
  .invalidBox{
    position: absolute;
    display: none;
    left: var(--invalidBox-left, 0);
    top: var(--invalidBox-top, 100%);
    background-color: var(--red);
    color: var(--gray0);
    padding: var(--standardPadding);
    z-index: 1;
  }
  .invalid:focus-within + .invalidBox { display: block; }
  .invalid.invalidOutline{ box-shadow: inset 0 0 0 calc(var(--standardPadding) - var(--borderWidth)) var(--red); }
  .invalid.invalidText{ color: var(--red) }
</style>