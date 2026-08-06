export const ssr = false;
import type { PageLoad } from "./$types";
import { commands } from "$lib/bindings";
import { newEmptyRootFields } from "$lib/data/branch/data";
import type { StateTreeRoot } from "$lib/logic/stateManager/types";

export const load: PageLoad<StateTreeRoot> = async ({params}) => {
  console.log(`loading page: ${params.path}`)
  try { return await loadRootBranch(params.path) }
  catch(e1) {
    if(params.path !== "Home") throw e1;
    try { return await createHomeBranch() }
    catch (e2) { throw new AggregateError([e1, e2])}
  }
};

async function loadRootBranch(path: string): Promise<StateTreeRoot> {
  const loadResult = await commands.loadRootBranch(path);
  if(loadResult.status === "error") throw new Error(`Failed to load ${path} as root branch.`)
  const {type, ...branch} = {...loadResult.data}
  return {branch: { ...newEmptyRootFields(), ...branch, type: "LoadedRootBranch"}}
}

async function createHomeBranch(): Promise<StateTreeRoot>{
  const createHomeResult = await commands.createHomeBranch()
  if(createHomeResult.status === "ok") return await loadRootBranch("Home");
  else {throw createHomeResult.error}
}