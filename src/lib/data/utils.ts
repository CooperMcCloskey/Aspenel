import type { Id } from "$lib/bindings";

type dataWithId = {id: Id};
export function sortByTimeCreated<T extends dataWithId>(array: T[]): T[]{ return array.toSorted((a, b) => a.id.localeCompare(b.id)) }
export function enforceExhaustiveSwitch(x: never): never{throw new Error(`Unhandled case: ${x}`);}