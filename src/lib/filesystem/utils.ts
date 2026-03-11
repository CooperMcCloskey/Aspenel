import type { LoadedDocument } from "$lib/types/fileHandling/DocumentLoadResult";
import type { FsDocument } from "$lib/types/rustTypes/FsDocument";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";


export function joinPath(base: string, part: string): Promise<string> {
  return invoke<string>("join_path", {base, part});
}

export function getDocumentHref(path: string){
  return path == "" ? "/document/Home" : `/document/${path}`;
}

export async function loadDocument(path: string | undefined): Promise<LoadedDocument>{
  console.log("loading document: " + path)
  if(path === undefined) throw new Error("Document path undefined")

  const fsDocument: Promise<FsDocument> = invoke<FsDocument>('read_document', {path}); //TODO: optimize to reduce the number of document reads
  const color: Promise<string> = invoke<string>('find_color', {path})

  const result: Promise<LoadedDocument> = Promise.all([fsDocument, color]).then(([fsDocument,color])=>{return {fsDocument,color,path}})
  console.log("load result:");
  console.log(await result);
  return result;
}

export async function deleteDocument(filename: string, path: string, viewUpdateCallback: ()=>void){
  const deleteConfirmed = await ask(`Are you sure you want to delete "${filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(deleteConfirmed) {
    await invoke('delete_file', {path});
    viewUpdateCallback();
  }
}