import type { Branch, LoadedBranch, LoadedRootBranch, RootBranch } from "$lib/bindings";

export type UntypedBranchVariant = Branch | LoadedBranch | RootBranch | LoadedRootBranch
export function isLoadedBranch(arg: any): arg is LoadedBranch {
  return arg && typeof arg === "object" && "branch" in arg;
}
