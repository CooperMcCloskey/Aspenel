import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import { filedata } from "../../../_logic/filedata.svelte";
import { stateManager } from "../../../_logic/operations.svelte";

//TODO: think about generalizing this with the attachView function
export function attachPropertySchema(schema: PropertySchema) {
  stateManager.pushOperation({
    redo: ()=>{
      filedata.branch.child_properties.push(schema)
    },
    undo: ()=>{
      filedata.branch.child_view_data = filedata.branch.child_view_data.filter(
        s => s.identifier.id !== schema.identifier.id
      );
    }
  });
}