import { isLoadedBranch } from "$lib/types/utils";
import { emptyLoadedBranch, newEmptyBranch } from "../_data/branch";
import type { LoadedBranch } from "../_types/LoadedBranch";

export const filedata: LoadedBranch = $state(emptyLoadedBranch());
export function setFiledata(data: LoadedBranch){ Object.assign(filedata, data) }
export function unsetFiledata(){ Object.assign(filedata, emptyLoadedBranch) }


export const childFiledata: Record<string, LoadedBranch> = $state({})

export function appendChildFiledata(data: Record<string, LoadedBranch>): void
export function appendChildFiledata(lb: LoadedBranch): void
export function appendChildFiledata(arg: Record<string, LoadedBranch> | LoadedBranch){
  if(isLoadedBranch(arg)) childFiledata[arg.branch.id] = arg; 
  else Object.assign(childFiledata, arg);
}

export function unsetChildFiledata(){ Object.keys(childFiledata).forEach(key => delete childFiledata[key]); }
export function removeChildFiledata(lb: LoadedBranch){ delete childFiledata[lb.branch.id] }