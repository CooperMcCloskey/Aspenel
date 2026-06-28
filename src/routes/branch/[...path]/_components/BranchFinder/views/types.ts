import type { BranchView } from "$lib/types/rustTypes/BranchView";
import type { WithoutTypeDiscriminator } from "$lib/types/utils";
import type { Component } from "svelte";

export type BranchViewType = BranchView["type"];
export const viewTypes = ["Icon", "Table"] satisfies readonly BranchViewType[];

export type BranchViewData = WithoutTypeDiscriminator<BranchView>

type BranchViewDataMap = {[K in BranchView as K["type"]]: Omit<K, "type">}
export type BranchViewComponent = {[K in BranchViewType]: Component<{viewData: BranchViewDataMap[K]}>}