import { sortByTimeCreated, type IdMap, type IdPath } from "$lib/data/utils";
import type { WritableDeep } from "type-fest";
import type { NodeChildren, NodeHandle, StateChange, StateTreeNode, StateTreeRoot, StateTreeVariant } from "./types";
import { commands, type Id } from "$lib/bindings";
import { stateManager } from "./StateManager.svelte";

export function getNode(tree: StateTreeRoot): StateTreeRoot
export function getNode(tree: StateTreeRoot, path: IdPath | undefined): StateTreeNode
export function getNode(tree: StateTreeRoot, path?: IdPath): StateTreeVariant{
  if (path === undefined) return tree
  let node: StateTreeNode | StateTreeRoot = tree 
  for(const id of path) {
    const children: NodeChildren | undefined = node.children
    if(children === undefined || children[id] === undefined) throw new Error(`Invalid Path: ${path}`)
    node = children[id];
  }
  return node
}

export function createNodeHandle(path: IdPath | undefined, applyCommand: (command: ()=>void, userCaused?: boolean)=>void): NodeHandle{
  return {
    path,
    get node(){ return getNode(stateManager.tree, path) },
    get branch(){ return this.node.branch },
    applyCommand(command: (node: WritableDeep<StateTreeNode>)=>void, userCaused?: boolean){ applyCommand(()=>command(this.node), userCaused) },
    async loadChildren(){
      if(this.node.children) return;
      const childLoadResult = await commands.loadDir(this.node.branch.path);
      if(childLoadResult.status === "error") throw childLoadResult.error;

      const childrenAsNodes = Object.entries(childLoadResult.data)
        .reduce<NodeChildren>((acc, [id, child])=>{
          acc[id] = {branch: {...child, type: "LoadedBranch"}}
          return acc
        }, {});
      this.applyCommand((node)=>{node.children = childrenAsNodes}, false)
    },
    get childArray(){ return sortByTimeCreated(this.node.children ?? {}).map((c)=>c.branch) }
  }
}

export function applyStateChange(change: StateChange){
  const {target, key, newValue} = change;
  if(newValue === undefined) Reflect.deleteProperty(target, key);
  else Reflect.set(target, key, newValue)
}
export function undoStateChange(change: StateChange){
  const {target, key, oldValue} = change
  if(oldValue === undefined) Reflect.deleteProperty(target, key);
  else Reflect.set(target, key, oldValue)
}