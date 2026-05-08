import { emptyLoadedBranch, newEmptyBranch } from "../_data/branch";
import type { LoadedBranch } from "../_types/LoadedBranch";

export const filedata: LoadedBranch = $state(emptyLoadedBranch());
export function setFiledata(data: LoadedBranch){ Object.assign(filedata, data) }
export function unsetFiledata(){ Object.assign(filedata, emptyLoadedBranch) }

export const childFiledata: Record<string, LoadedBranch> = $state({})
export function setChildFiledata(data: Record<string, LoadedBranch>){ Object.assign(childFiledata, data) }
export function unsetChildFiledata(){ Object.assign(childFiledata, {}) }
export function appendChildFiledata(lb: LoadedBranch){ childFiledata[lb.branch.id] = lb }
export function removeChildFiledata(lb: LoadedBranch){ delete childFiledata[lb.branch.id] }