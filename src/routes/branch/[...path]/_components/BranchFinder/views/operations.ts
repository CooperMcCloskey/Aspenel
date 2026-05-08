import { newIconView, newTableView } from "../../../_data/view";
import type { BranchViewData, BranchViewType } from "../../../_types/BranchViewTypes";
import type { BranchView } from "$lib/types/rustTypes/BranchView";
import { filedata } from "../../../_logic/filedata.svelte";
import { stateManager, type Operation } from "../../../_logic/operations.svelte";

export function newView(type: BranchViewType){
  let viewData: BranchViewData | undefined = undefined;
  if(type == "Icon") viewData = newIconView();
  if(type == "Table") viewData = newTableView();
  if(viewData == undefined) throw Error("Unknown view type");
  
  stateManager.pushOperation({
    redo: ()=>{
      filedata.branch.child_view_data.push({...viewData, type} as BranchView)
    },
    undo: ()=>{
      filedata.branch.child_view_data = filedata.branch.child_view_data.filter(
        v => v.identifier.id !== viewData.identifier.id
      );
    }
  });
}