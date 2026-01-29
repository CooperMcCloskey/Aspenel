<script lang="ts">
  import { onMount } from "svelte";

  export let fileType;
  let input: HTMLInputElement;

  function onNameUpdated(name: string){
    console.log(name)
  }
  onMount(()=>{
    input.addEventListener("keydown", (e)=>{
      if(e.key == "Enter") input.blur();
    })
    input.addEventListener("blur", ()=>{ onNameUpdated(input.value) })
  })
</script>

<input bind:this={input} type="text" placeholder={`${fileType} name`}/>

<style>
  input{
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    text-overflow: ellipsis;
    width: 100%;
  }
</style>