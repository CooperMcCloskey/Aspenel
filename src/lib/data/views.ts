import { newIdentifier } from "$lib/data/identifier";
import type { IconViewData } from "$lib/types/rustTypes/IconViewData";
import type { TableViewData } from "$lib/types/rustTypes/TableViewData";

export function newTableView(): TableViewData{
  return {
    identifier: newIdentifier("Table View")
  }
}

export function newIconView(): IconViewData{
  return {
    identifier: newIdentifier("Icon View")
  }
}