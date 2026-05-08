import { invoke } from "@tauri-apps/api/core";
import { childFiledata, filedata } from "./filedata.svelte";

export const saveManager = createSaveManager();

export function createSaveManager(){
  const editedChildIds = new Set<string>();

  let saving: boolean = $state(false);
  let saveError: boolean = $state(false);
  let saved: boolean = $state(true);

  return {
    get saving() { return saving; },
    get saveError() { return saveError; },
    get saved() { return saved; },

    
    setEdited(){ saved = false },
    addEditedChild(id: string) { this.setEdited(); editedChildIds.add(id) },
    removeEditedChild(id: string) { editedChildIds.delete(id) },

    async save(){
      saving = true;

      let savePromise = Promise.all([
        invoke("save_branch", {branch: filedata.branch, path: filedata.path}), //save current branch
      
        [...editedChildIds].map((cId)=>{ //save edited children
          const child = childFiledata[cId];
          return invoke<void>("save_branch", {branch: child.branch, path: child.path})
        })
      ])

      savePromise.then(()=>{
        saving = false;
        saveError = false;
        saved = true;
      }).catch((error)=>{
        console.error(error)
        saving = false;
        saveError = true;
        saved = false;
      });
    }
  }
}