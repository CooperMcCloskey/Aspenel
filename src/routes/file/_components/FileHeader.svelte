<script lang="ts">
    import { goto } from "$app/navigation";
    import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  
  let {name, path, fileType}: {name: string, path: string, fileType: string} = $props()

  let input: HTMLInputElement;
  
  $effect(()=>{
    input.value = name
  })

  async function onNameUpdated(name: string) {
    const newPath = await invoke("rename_file", {oldPath: path, newName: input.value});
    console.log(`/file/${fileType.toLowerCase()}/${newPath}`);
    goto(`/file/${fileType.toLowerCase()}/${newPath}`);
  }

  onMount(() => {
    input.focus();
    
    input.addEventListener("keydown", (e) => {
      if (e.key == "Enter") input.blur();
    });
    input.addEventListener("blur", () => {
      onNameUpdated(input.value);
    });
  });
</script>

<header>
  <input bind:this={input} type="text" placeholder={`New ${fileType}`} />
</header>

<style>
  header {
    grid-area: 2/2/3/6;
  }
  input {
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    text-overflow: ellipsis;
    width: 100%;
  }
</style>
