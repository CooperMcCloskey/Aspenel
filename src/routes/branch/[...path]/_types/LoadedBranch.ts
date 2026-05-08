import type { Branch } from "../../../../lib/types/rustTypes/Branch";

export interface LoadedBranch{
  branch: Branch,
  filename: string,
  color: string,
  path: string
}