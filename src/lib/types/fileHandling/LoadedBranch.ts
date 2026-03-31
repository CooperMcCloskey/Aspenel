import type { FsBranch } from "../rustTypes/FsBranch";

export interface LoadedBranch{
  fsBranch: FsBranch,
  color: string,
  path: string
}
