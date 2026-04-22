import { newEmptyBranch } from "$lib/data/branch";
import type { LoadedBranch } from "$lib/types/fileHandling/LoadedBranch";
import type { Branch } from "$lib/types/rustTypes/Branch"

export const filedata: {
  branch: Branch
  name: string
  color: string //this color is the resolved color, different from the possible color in the branch data
  path: string
} = $state({
  branch: newEmptyBranch(),
  name: "Loading...",
  color: "var(--red)",
  path: "Loading..."
});

export function setFiledata(data: LoadedBranch){
  filedata.branch = data.fsBranch.branch,
  filedata.name = data.fsBranch.filename,
  filedata.color = data.color,
  filedata.path = data.path
}