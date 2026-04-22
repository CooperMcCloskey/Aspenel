import type { Branch } from "$lib/types/rustTypes/Branch";
import { invoke } from "@tauri-apps/api/core";

export const saveManager = createSaveManager();

export function createSaveManager(){
  let saving: boolean = $state(false);
  let saveError: boolean = $state(false);
  let saved: boolean = $state(true);

  return {
    get saving() { return saving; },
    get saveError() { return saveError; },
    get saved() { return saved; },

    update(){ saved = false },

    async save(branch: Branch, path: string){
      saving = true;
      invoke("save_branch", {branch, path}).then(()=>{
        saving = false;
        saveError = false;
        saved = true;
        console.log("saved")
      }).catch((error)=>{
        console.error(error)
        saving = false;
        saveError = true;
        saved = false;
      });
    }
  }
}