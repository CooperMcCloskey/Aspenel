import { getNode, newStateTree } from "$lib/data/branch/data";
import type { IdPath, NodeChildren, StateTreeRoot, StateTreeVariant } from "$lib/data/branch/types";
import { applyPatches, produce, produceWithPatches, type Draft, type Immutable, type Patch } from "immer";
import { saveTree } from "./filesystem";
import type { Mutable } from "$lib/types/utils";
import { commands, type Id, type LoadedBranch, type LoadedRootBranch } from "$lib/bindings";
import { sortByTimeCreated } from "$lib/data/utils";

export type SaveState = "edited" | "saving" | "saved" | "save error";

type Operation = {
  patches: Patch[];
  inversePatches: Patch[];
};

type State = {
  readonly tree: StateTreeRoot;
  saveState: SaveState;
  editedPaths: IdPath[];
  undoStack: Operation[];
  redoStack: Operation[];
};

//TODO: eliminate immer for optimization

export const stateManager = createStateManager();

//FIXME: make ctrl z ctrl shift z work.
export function createStateManager(){
  
  let state: State = $state.raw(createNewState());

  function createNewState(tree?: StateTreeRoot): State{
    return {
      tree: tree ?? newStateTree(),
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
    get tree(): StateTreeRoot{ return state.tree },
    get rootBranch(): LoadedRootBranch{ return state.tree.branch },
    get saveState(): SaveState{ return state.saveState },
    get activeChildren(): LoadedBranch[]{ 
      if(state.tree.children === undefined) return [];
      const children = Object.values(state.tree.children).map(c=>c.branch);
      return sortByTimeCreated(children)
    },

    new(tree?: StateTreeRoot){ state = createNewState(tree) },
    getNode(path?: IdPath){ return getNode(state.tree, path) },

    async loadChildren(path?: IdPath){ 
      const parent = this.getNode(path)
      if(parent.children) return;
      console.log(`Loading children at ${parent.branch.path}`);
      
      const children = await commands.loadDir(parent.branch.path); 
      if(children.status === "error") throw children.error;

      const childrenAsNodes = Object.entries(children.data)
        .reduce<NodeChildren>((acc, [id, child])=>{
          acc[id] = {branch: {...child, type: "LoadedBranch"}}
          return acc
        }, {});

      this.applyOperationRecipe((draft)=>{
        const parent = getNode<true>(draft, path);
        parent.children = childrenAsNodes;
      })
    },

    async applyOperationRecipe(operationRecipe: (draft: Draft<StateTreeRoot>)=>void) {
      const [tree, patches, inversePatches] = produceWithPatches(state.tree, (draft)=>{operationRecipe(draft)});
      
      const history = {patches, inversePatches, editedChildren: [...state.editedPaths]}

      const saveState = "edited";
      const editedChildPaths = [...state.editedPaths, ...getAffectedChildren(patches)];
      const undoStack = [...state.undoStack, history];
      const redoStack = [] as Operation[];

      state = {tree, saveState, editedPaths: editedChildPaths, undoStack, redoStack}
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
      state = produce(state, (draft)=>{draft.saveState = "saving"});
      const result = await saveTree(state.tree, state.editedPaths, state.tree.branch.path)
      state = produce(state, (draft)=>{draft.saveState = result});
    }
  }
}