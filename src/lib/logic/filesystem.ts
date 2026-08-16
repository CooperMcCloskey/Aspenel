import { sep as pathSeparator } from '@tauri-apps/api/path';

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