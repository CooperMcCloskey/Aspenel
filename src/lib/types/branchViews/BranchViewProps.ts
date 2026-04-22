import type { BranchView, BranchViewData } from "../rustTypes/BranchViewData";
import type { LoadedBranch } from "../fileHandling/LoadedBranch";

export interface BranchViewProps<T extends BranchViewData>{
  viewData: T,
  children: LoadedBranch[],
}