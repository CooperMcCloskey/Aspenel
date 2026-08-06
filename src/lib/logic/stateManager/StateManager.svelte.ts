import { newStateTree } from "$lib/data/branch/data";
import type { IdPath } from "$lib/data/utils";
import { applyStateChange, createNodeHandle, getNode, undoStateChange } from "./stateLogic";
import type { NodeHandle, SaveState, StateTreeNode, StateTreeRoot } from "./types";
import { commands, type LoadedRootBranch } from "$lib/bindings";
import { StateHistoryTracker } from "./StateHistoryTracker";

class StateManager{
  //all roughly defined in the constructpr
  private rawTree: StateTreeRoot = $state(undefined)!; //proxied by svelte, not by the state history tracker.
  
  saveState: SaveState = $state(undefined)!;
  private historyTracker: StateHistoryTracker = undefined!;
  private transactionDepth: number = undefined!;

  constructor(tree?: StateTreeRoot) { this.reset(tree) }

  get tree(): StateTreeRoot{ return this.historyTracker.setRoot(this.rawTree) };
  get rootNodeHandle(){ return this.nodeHandle() }
  get rootBranch(): LoadedRootBranch{ return this.tree.branch } 

  reset(tree: StateTreeRoot = newStateTree()) {
    this.saveState = "saved"
    this.historyTracker = new StateHistoryTracker();
    this.transactionDepth = 0;

    this.rawTree = tree
  }  

  nodeHandle(path?: IdPath): NodeHandle{ return createNodeHandle(path, this.applyCommand)}  

  async save(){
    this.saveState = "saving"
    let savePromise = Promise.all(
    [...this.historyTracker.editedPaths].map(async (path)=>{
      const node = getNode(this.tree, path)
      const branch = node.branch
      const branchResult = await commands.writeBranch(branch, branch.path)
      if(branchResult.status === "error") throw new Error(branchResult.error);
    })
  )

  return await savePromise
    .then(() => this.saveState = "saved")
    .catch((err) => { this.saveState ="save error"; throw err })
  }

  applyCommand: (command: ()=>void, userCaused?: boolean)=>void = (command, userCaused = true)=>{ 
    this.saveState = "edited";
    const isRoot = this.transactionDepth === 0;
    this.transactionDepth++;

    if(isRoot) this.historyTracker.newTransaction(userCaused);

    try { command() }
    catch (err) {
      if(isRoot) this.rollbackCommand(err);
      else throw err;
    }
    finally { 
      this.transactionDepth--
      if(this.historyTracker.undoStack.at(-1)?.changes.length === 0) this.historyTracker.undoStack.pop(); //remove no-ops from the history
      if(this.historyTracker.undoStack.length === 1 && !userCaused) this.historyTracker.undoStack.pop(); //remove system-caused loading commands from the history 
      console.log(this.historyTracker.undoStack)
    }  
  }

  rollbackCommand(err: unknown){
    const historyEntry = this.historyTracker.undoStack.pop();
    if(historyEntry === undefined) throw new Error("Attempted to rollback command that did not exist in history.")
    const changes = historyEntry.changes
    for(let i = changes.length-1; i >= 0; i--) undoStateChange(changes[i]!);
    throw err;
  }

  undo(): void{ 
    const historyEntry = this.historyTracker.undoStack.pop();
    if(historyEntry === undefined) return;
    const changes = historyEntry.changes

    for(let i = changes.length-1; i >= 0; i--) undoStateChange(changes[i]!);
    this.historyTracker.redoStack.push(historyEntry);

    if(!historyEntry.userCaused) this.undo() //repeats undo until reaching the last user-caused change
  }

  redo(): void{
    const historyEntry = this.historyTracker.redoStack.pop();
    if(historyEntry === undefined) return;
    const changes = historyEntry.changes

    for(let i = 0; i < changes.length; i++) applyStateChange(changes[i]!);
    this.historyTracker.undoStack.push(historyEntry);

    const nextHistoryEntry = this.historyTracker.redoStack.at(-1)
    if(nextHistoryEntry && !nextHistoryEntry.userCaused) this.redo() //repeats redo until the transaction was user caused.
  }
}
export const stateManager: StateManager = new StateManager();
