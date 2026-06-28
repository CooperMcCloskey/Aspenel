import { invoke } from "@tauri-apps/api/core";

export function joinPath(base: string, part: string): Promise<string> {
  return invoke<string>("join_path", {base, part}); //TODO: check if this can run without an aysnc invoke call
}

export async function separatePath(path: string): Promise<{separator: string, pathComponents: string[], cumulativePathComponents: string[]}>{
  const separator = await invoke<string>("get_path_separator");
  const pathComponents: string[] = await invoke("get_path_components", {path});
  const cumulativePathComponents: string[] = pathComponents.map((_, i) => pathComponents.slice(0, i+1).join(separator));
  return {separator, pathComponents, cumulativePathComponents}
}

export function branchHref(path: string){
  return path == "" ? "/branch/Home" : `/branch/${path}`;
}