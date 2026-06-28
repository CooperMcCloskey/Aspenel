import { Menu, MenuItem, type MenuOptions } from "@tauri-apps/api/menu"
import { attachView } from "./operations"
import { viewTypes } from "./types"
import { createView } from "./data"
import { deleteBranch } from "../operations"
import type { LoadedBranch } from "$lib/types/rustTypes/LoadedBranch"

export function createViewMenu(): Promise<Menu>{
  return Menu.new({
    items: viewTypes.map(type => ({
      id: type,
      text: `New ${type} View`,
      action: ()=>attachView(createView(type)),
    }))
  })
} 

export function branchEditMenu(branch: LoadedBranch): Promise<Menu>{
    return Menu.new({
      items: [
        { text: "Rename", action: ()=>{/*TODO: Add renaming*/} },
        { text: "Copy", action: ()=>{/*TODO: Add copying pasting*/}},
        { text: "Delete", action: ()=>{deleteBranch(branch)}}, //TODO: Make this an operation that only actually deletes on save.
      ],
    })
  } 