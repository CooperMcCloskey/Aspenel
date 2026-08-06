import type { IdPath } from "$lib/data/utils";
import { sep as pathSeparator } from '@tauri-apps/api/path';
import { commands } from "$lib/bindings";

export async function separatePath(path: string): Promise<{single: string, cumulative: string}[]>{
  const separator = pathSeparator()
  const singlePathComponents: string[] = path.split(separator)
  const pathComponents = singlePathComponents.map((single, i) => ({single, cumulative: singlePathComponents.slice(0, i+1).join(separator)}));

  return pathComponents
}

export function joinPath(part1: string, part2: string): string { return part1.concat(pathSeparator(), part2) }

export function branchHref(path: string){
  return path == "" ? "/branch/Home" : `/branch/${path}`;
}

// export async function saveTree(tree: StateTreeRoot, editedBranchPaths: Immutable<IdPath[]>, rootPath: string): Promise<SaveState>{
//   let savePromise = Promise.all(
//     [...editedBranchPaths].map(async (path)=>{
//       const node = getNode(tree, path)
//       const branch = node.branch
//       const branchResult = await commands.writeBranch(branch, branch.path)
//       if(branchResult.status === "error") throw new Error(branchResult.error);
//     })
//   )

//   return await savePromise
//     .then(() => "saved" as SaveState)
//     .catch((err) => "save error" as SaveState)
// }
