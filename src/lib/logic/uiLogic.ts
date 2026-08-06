import { stateManager } from "./stateManager/StateManager.svelte";

export function renameElement(el: HTMLElement, renameCommand: (name: string)=>void){
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
    stateManager.applyCommand(()=>renameCommand(el.innerText));
  }
}