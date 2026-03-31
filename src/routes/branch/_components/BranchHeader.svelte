<script lang="ts">
    import { goto } from "$app/navigation";
    import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  
  let {name: filename, path, fileType}: {name: string, path: string, fileType: "Branch" | "Leaf"} = $props()

  let input: HTMLInputElement;
  $effect(()=>{
    input.value = filename
  })

  async function onNameUpdated(name: string) {
    const newPath = await invoke<string>("rename_file", {oldPath: path, newName: input.value});
    goto(`/branch/${newPath}`);
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
