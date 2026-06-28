import { stateManager } from "../../routes/branch/[...path]/_logic/operations.svelte";

export function renameElement(el: HTMLElement, updateData: (name: string)=>void){
  const oldName = el.innerText;
  el.contentEditable = "true";
  el.focus();

  //move carat to the end
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);

  el.onkeydown = (e)=>{ if (e.key == "Enter") el.blur()}
  el.onblur = ()=>{
    el.contentEditable = "false";
    stateManager.pushOperation({
      redo: ()=>updateData(el.innerText),
      undo: ()=>updateData(oldName)
    })
  }
}