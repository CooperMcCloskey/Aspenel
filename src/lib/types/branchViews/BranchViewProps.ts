import type { BranchViewData } from "../rustTypes/BranchViewData";
import type { LoadedBranch } from "../fileHandling/LoadedBranch";
import type { WithoutTypeDiscriminator } from "../utils";

export interface BranchViewProps<T extends WithoutTypeDiscriminator<BranchViewData>>{
  viewData: T,
  children: LoadedBranch[],
  refreshPage: ()=>void,
}