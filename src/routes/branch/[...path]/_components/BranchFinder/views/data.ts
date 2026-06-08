import { newIdentifier } from "$lib/data/identifier";
import type { BranchView } from "$lib/types/rustTypes/BranchView";
import type { BranchViewType } from "./types";

export function createView(type: BranchViewType): BranchView { 
  const identifier = newIdentifier(`${type} View`);

  switch (type){
    case "Icon": return {
      type,
      identifier,
    }
    case "Table": return {
      type,
      identifier,
      hidden_property_ids: []
    }
  }
}