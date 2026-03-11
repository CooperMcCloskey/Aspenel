import type { FsDocument } from "../rustTypes/FsDocument";

export interface LoadedDocument{
  fsDocument: FsDocument,
  color: string,
  path: string
}
