import type { Id } from "$lib/bindings";

export type IdPath = readonly Id[];
export function idPathsEqual(a: IdPath, b: IdPath){ return a.length === b.length && a.every((id, i)=>id==b[i]) }

type dataWithId = {id: Id};
export function sortByTimeCreated<T extends dataWithId>(array: T[]): T[]{ return array.toSorted((a, b) => a.id.localeCompare(b.id)) }