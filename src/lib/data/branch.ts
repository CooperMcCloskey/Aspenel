import type { Branch } from "$lib/types/rustTypes/Branch";

export function newEmptyBranch(): Branch{
  return {
    id: "0",
    color: "var(--red)",
    child_view_data: [],
    property_values: [],
    child_properties: []
  }
}