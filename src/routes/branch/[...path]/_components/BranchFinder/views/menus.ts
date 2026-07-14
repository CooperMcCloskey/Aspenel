import { Menu } from "@tauri-apps/api/menu"
import { attachView } from "./operations"
import { viewTypes } from "../../../../../../lib/data/childView/types"
import { createChildView } from "../../../../../../lib/data/childView/data"
import type { LoadedBranch } from "$lib/types/bindings/LoadedBranch"
import { deleteChild } from "../operations"
import type { IdPath } from "$lib/data/branch/types"

export function createViewMenu(): Promise<Menu>{
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: ()=>attachView(createChildView(type)),
    }))
  })
} 

export function branchEditMenu(path: IdPath): Promise<Menu>{
    return Menu.new({
      items: [
        { text: "Rename", action: ()=>{/*TODO: Add renaming*/} },
        { text: "Copy", action: ()=>{/*TODO: Add copying pasting*/}},
        { text: "Delete", action: ()=>{deleteChild(path)}}, //TODO: Make this an operation that only actually deletes on save.
      ],
    })
  } 