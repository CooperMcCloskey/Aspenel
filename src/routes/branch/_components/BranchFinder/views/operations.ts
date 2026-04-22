import { newIconView, newTableView } from "$lib/data/views";
import type { Operation } from "$lib/logic/operations.svelte";
import type { BranchViewData, BranchViewType } from "$lib/types/rustTypes/BranchViewData";
import { filedata } from "../../../[...path]/filedata.svelte";

export function newView(type: BranchViewType): Operation{
  let viewData: BranchViewData | undefined = undefined;
  if(type == "Icon") viewData = newIconView();
  if(type == "Table") viewData = newTableView();
  if(viewData == undefined) throw Error("Unknown view type");
  return{
    redo: ()=>{
      filedata.branch.child_view_data.push({...viewData, type})
    },
    undo: ()=>{
      filedata.branch.child_view_data = filedata.branch.child_view_data.filter(
        v => v.identifier.id !== viewData.identifier.id
      );
    }
  }
}