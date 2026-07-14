import { getNode, newEmptyLoadedBranchNode } from "$lib/data/branch/data";
import type { LoadedBranchNode, IdPath } from "$lib/data/branch/types";
import type { Id } from "$lib/types/bindings/Id";
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch";
import { applyPatches, produce, produceWithPatches, type Draft, type Immutable, type Patch } from "immer";
import { loadDir, saveTree } from "./filesystem";
import type { Mutable } from "$lib/types/utils";

export type SaveState = "edited" | "saving" | "saved" | "save error";

type Operation = {
  patches: Patch[];
  inversePatches: Patch[];
};

type State = Immutable<{
  tree: LoadedBranchNode;
  saveState: SaveState;
  editedPaths: IdPath[];
  undoStack: Operation[];
  redoStack: Operation[];
}>;

export const stateManager = createStateManager();


//FIXME: make ctrl z ctrl shift z work.
export function createStateManager(){
  
  let state: State = $state.raw(createNewState());

  function createNewState(tree?: LoadedBranchNode): State{
    return {
      tree: tree ?? newEmptyLoadedBranchNode(),
      saveState: "saved",
      editedPaths: [],
      undoStack: [],
      redoStack: []
    }
  }

  function getAffectedChildren(patches: Patch[]): IdPath[]{
    const affectedChildren = new Map<string, IdPath>();

    for (const patch of patches) {
      const path = patch.path.reduce<Id[]>((ids, value, i) => {
        if (value === "children" && patch.path.length > i + 1) ids.push(patch.path[i + 1] as Id);
        return ids;
      }, []);
      const key = path.join("/");
      affectedChildren.set(key, path);
    }

    return [...affectedChildren.values()]
  }

  return {
    get state(): State{ return state },
    get tree(): LoadedBranchNode{ return state.tree },
    get activeBranch(): LoadedBranch{ return state.tree.node },
    get activeChildren(): LoadedBranch[]{ return state.tree.children ? Object.values(state.tree.children).map(c=>c.node) : []},
    get saveState(): SaveState{ return state.saveState },
    
    new(tree?: LoadedBranchNode){ state = createNewState(tree) },

    getNode(path?: IdPath){ return getNode(state.tree, path) },

    async loadChildren(path?: IdPath){ 
      const parent = this.getNode(path)
      if(parent.children) return;
      const children = await loadDir(parent.node.path, parent.node.color); 
      this.applyOperationRecipe((draft)=>{
        const parent = getNode(draft, path);
        parent.children = children;
      })
    },

    async applyOperationRecipe(operationRecipe: (draft: Draft<LoadedBranchNode>)=>void) {
      const [tree, patches, inversePatches] = produceWithPatches(state.tree, (draft)=>{operationRecipe(draft)});
      
      const history = {patches, inversePatches, editedChildren: [...state.editedPaths]}

      const saveState = "edited";
      const editedChildPaths = [...state.editedPaths, ...getAffectedChildren(patches)];
      const undoStack = [...state.undoStack, history];
      const redoStack = [] as Operation[];

      state = {tree, saveState, editedPaths: editedChildPaths, undoStack, redoStack}
      console.log(state)
    },

    undo() {
      const history = state.undoStack.at(-1);
      const undoStack = state.undoStack.slice(0, -1);

      if(history === undefined) return;

      const tree = applyPatches(state.tree, history.inversePatches as Mutable<Patch[]>);

      const saveState =  "edited";
      const editedChildPaths = state.editedPaths; 
      const redoStack = [...state.redoStack, history];

      state = { tree, saveState, editedPaths: editedChildPaths, undoStack, redoStack }
    },
    redo() {
      const history = state.redoStack.at(-1)
      const redoStack = state.redoStack.slice(0, -1);

      if(history === undefined) return;

      const tree = applyPatches(state.tree, history.patches as Mutable<Patch[]>);

      const saveState = "edited";
      const editedChildPaths = state.editedPaths;
      const undoStack = [...state.undoStack, history];

      state = { tree, saveState, editedPaths: editedChildPaths, undoStack, redoStack }
    },

    async save(){
      console.log("saving")
      state = produce(state, (draft)=>{draft.saveState = "saving"});
      const result = await saveTree(state.tree, state.editedPaths, state.tree.node.path)
      state = produce(state, (draft)=>{draft.saveState = result});
    }
  }
}