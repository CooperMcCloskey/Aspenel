import type { BranchView } from "../../../../../../lib/types/rustTypes/BranchView";
import { filedata } from "../../../_logic/filedata.svelte";
import { stateManager, type Operation } from "../../../_logic/operations.svelte";

export function attachView(view: BranchView) {
  stateManager.pushOperation({
    redo: ()=>{
      filedata.branch.child_view_data.push(view)
    },
    undo: ()=>{
      filedata.branch.child_view_data = filedata.branch.child_view_data.filter(
        v => v.identifier.id !== view.identifier.id
      );
    }
  });
}

