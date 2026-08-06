import { idPathsEqual, type IdPath } from "$lib/data/utils";
import { undoStateChange } from "./stateLogic";
import type { CommandHistoryEntry, StateChange, StateTreeRoot } from "./types";

export class StateHistoryTracker{
  
  editedPaths: IdPath[];
  undoStack: CommandHistoryEntry[];
  redoStack: CommandHistoryEntry[];


  private proxyCache: WeakMap<object, object>;
  private objectCache: WeakMap<object, object>;

  private pathCache: WeakMap<object, IdPath>;
  private childMapObjects: WeakSet<object>

  constructor(){
    this.editedPaths = []; 
    this.undoStack = []; 
    this.redoStack = [];

    this.proxyCache = new WeakMap();
    this.objectCache = new WeakMap();

    this.pathCache = new WeakMap();
    this.childMapObjects = new WeakSet();
  }

  setRoot(tree: StateTreeRoot){ 
    if (!this.pathCache.has(tree)) this.pathCache.set(tree, []);
    return this.setProxy(tree);
  }

  private recordDelete<T extends object>(target: T, key: string | symbol): boolean {
    console.log("delete")
    if(!Object.hasOwn(target, key)) return true;
    const oldValue = Reflect.get(target, key);
    if(oldValue === undefined) throw new Error("Undefined is not allowed as a value in the state.")

    this.pushHistory({target, key, oldValue, newValue: undefined});

    return Reflect.deleteProperty(target, key)
  }

  private setProxy<T extends object>(obj: T): T{
    if(this.proxyCache.has(obj)) return this.proxyCache.get(obj) as T;
    const proxy: T = new Proxy(obj, {

      get: (target, key, receiver)=>{
        if (typeof key === "symbol") return Reflect.get(target, key, receiver);
        const value = Reflect.get(target, key, receiver);
        if(value === null || typeof value !== "object") return value;

        const parentPath = this.pathCache.get(target);
        if(!parentPath) throw new Error(`Unregistered target: ${JSON.stringify(target)}`)
        if (key === "children") this.childMapObjects.add(value);
        const childPath = this.childMapObjects.has(target)
          ? [...parentPath, String(key)]
          : parentPath;
        this.pathCache.set(value, childPath);

        return this.setProxy(value);
      },

      set: (target, key, newValue, receiver)=>{
        if(newValue === undefined) return this.recordDelete(target,key) //State never contained undefined properties so setting undefined is used to indicate deletion in history.
        if(this.objectCache.has(newValue)) newValue = this.objectCache.get(newValue)!;

        const oldValue = Reflect.get(target, key, receiver);
        if(Object.is(oldValue, newValue)) return true;

        this.pushHistory({target, key, oldValue, newValue})

        return Reflect.set(target, key, newValue, receiver);
      },

      deleteProperty: (target, key)=>this.recordDelete(target,key)
    })
    this.proxyCache.set(obj, proxy)
    this.objectCache.set(proxy, obj)
    return proxy
  }

  private pushHistory(change: StateChange){
    const historyEntry = this.undoStack.at(-1);
    if(historyEntry === undefined) throw new Error(`No history entry to assign to. Change: ${JSON.stringify(change)}`);
    historyEntry.changes.push(change);

    if(change.key === "children") return //loading children so branches aren't actually edited.
    
    const path = this.pathCache.get(change.target);
    if (path === undefined) throw new Error(`Unregistered change target: ${JSON.stringify(change)}`);

    if(!this.editedPaths.some((p)=>idPathsEqual(p, path))) this.editedPaths.push(path);
  }

  newTransaction(userCaused: boolean){
    this.undoStack.push({userCaused, changes: []});
    console.log()
    this.redoStack = [];
  }  
}