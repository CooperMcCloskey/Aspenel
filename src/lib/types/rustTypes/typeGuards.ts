import type { CategoryData } from "./CategoryData";
import type { FileData } from "./FileData";
import type { ProjectData } from "./ProjectData";

export function isCategory(file: FileData): file is { "type": "Category" } & CategoryData{  
  return file.type === "Category";
}

export function isProject(file: FileData): file is { "type": "Project" } & ProjectData{
  return file.type === "Project";
}