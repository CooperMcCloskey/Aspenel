import type { Id } from "$lib/bindings";

export type IdPath = readonly Id[];
export function idPathsEqual(a: IdPath, b: IdPath){ return a.length === b.length && a.every((id, i)=>id==b[i]) }

export type dataWithId = {id: Id}
export type IdMap<T> = {[x: Id]: T}
export function sortByTimeCreated<T>(map: IdMap<T>): T[]{ return Object.entries(map).toSorted((a, b) => a[0].localeCompare(b[0])).map((e)=>e[1]) }

export function systemStringToDisplay(s: string): string {
  const spaced = s
    .replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[a-zA-Z])(?=\d)/g, " ")
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}