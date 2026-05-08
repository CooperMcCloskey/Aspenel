import type { LoadedBranch } from "./LoadedBranch";
import type { BranchView } from "../../../../lib/types/rustTypes/BranchView";
import type { WithoutTypeDiscriminator } from "../../../../lib/types/utils";

export interface BranchViewProps<T extends BranchViewData>{
  viewData: T,
}

export type BranchViewData = WithoutTypeDiscriminator<BranchView>
export type BranchViewType = BranchView["type"];
