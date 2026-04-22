import { saveManager } from "$lib/filesystem/saving.svelte";

type VoidFn = ()=>void;  
export type Operation = {undo: VoidFn, redo: VoidFn};

export const stateManager = $state(createStateManager())

export function createStateManager(){
  const undoStack: Operation[] = [];
  const redoStack: Operation[] = [];
  let refresh: number = 0;

  return {
    pushOperation(operation: Operation){
      operation.redo();
      saveManager.update();
      undoStack.push(operation);
      redoStack.length = 0;
    },
    undo(){
      const operation = undoStack.pop() ?? {undo: ()=>{}, redo: ()=>{}};
      redoStack.push(operation);
      operation.undo();
    },
    redo(){
      const operation = redoStack.pop() ?? {undo: ()=>{}, redo: ()=>{}};
      undoStack.push(operation);
      operation.redo();
    },
    refresh(){ refresh += 1 }
  };
}
