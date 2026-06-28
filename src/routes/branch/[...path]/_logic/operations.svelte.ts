import { saveManager } from "./saving.svelte";

export type Operation = {undo: VoidFunction, redo: VoidFunction};

export const stateManager = $state(createStateManager())
//FIXME: make ctrl z ctrl shift z work.
export function createStateManager(){
  const undoStack: Operation[] = [];
  const redoStack: Operation[] = [];

  return {
    pushOperation(operation: Operation){
      operation.redo();
      saveManager.setEdited();
      undoStack.push(operation);
      redoStack.length = 0;
    },
    pushChildOperation(id: string, operation: Operation){
      this.pushOperation(operation),
      saveManager.addEditedChild(id)
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
    }
  };
}