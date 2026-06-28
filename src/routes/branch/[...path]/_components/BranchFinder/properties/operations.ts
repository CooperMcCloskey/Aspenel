import type { PropertySchema } from "$lib/types/rustTypes/PropertySchema";
import type { Property } from "$lib/types/rustTypes/Property";
import { childFiledata, filedata } from "../../../_logic/filedata.svelte";
import { stateManager } from "../../../_logic/operations.svelte";
import type { LoadedProperty, LoadedPropertyUnion, PropertyType } from "./types";

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

export function updatePropertyValue<T extends PropertyType>(p: LoadedProperty<T>){
  const branch = childFiledata[p.branchID].branch
  const key = p.schema.identifier.id

  //FIXME: this likely needs to be cloned or something
  const oldProperty = branch.property_values[key]

  stateManager.pushChildOperation(p.branchID, {
    redo: ()=> p.value === null ? delete branch.property_values[key] : branch.property_values[key] = p as Property,
    undo: ()=> oldProperty === null ? delete branch.property_values[key] : branch.property_values[key] = oldProperty
  })
}