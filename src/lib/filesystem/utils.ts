import type { DocumentLoad } from "$lib/types/fileHandling/DocumentLoadResult";
import type { FsDocument } from "$lib/types/rustTypes/FsDocument";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";


export function joinPath(base: string, part: string): string {
  return `${base}/${part}`.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}

export async function loadDocument(path: string | undefined): Promise<DocumentLoad>{
  if(path=="undefined") throw new Error("Document path undefined")

  const fsDocument: Promise<FsDocument> = invoke<FsDocument>('read_document', {path});
  const color: Promise<string> = invoke<string>('get_color', {path})

  const result: Promise<DocumentLoad> = Promise.all([fsDocument, color]).then(([fsDocument,color])=>{return {fsDocument,color}})
  return result;
}

export async function deleteDocument(filename: string, path: string, viewUpdateCallback: ()=>void){
  const deleteConfirmed = await ask(`Are you sure you want to delete "${filename}"?`, {
    title: "Aspenel",
    kind: "warning"
  })
  if(deleteConfirmed) {
    await invoke('delete_file', {path})
    viewUpdateCallback();
  }
}