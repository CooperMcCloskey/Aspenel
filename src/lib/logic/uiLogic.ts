import type { LoadedBranchNode } from "$lib/data/branch/types";
import type { Mutable } from "$lib/types/utils";
import { stateManager } from "./state.svelte";

export function renameElement(el: HTMLElement, renameOperation: (name: string, draft: Mutable<LoadedBranchNode>)=>void){
  el.contentEditable = "true";
  el.focus();

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);

  el.onkeydown = (e)=>{ if (e.key == "Enter") el.blur()}
  el.onblur = ()=>{
    el.contentEditable = "false";
    stateManager.applyOperationRecipe((draft) => renameOperation(el.innerText, draft))
  }
}