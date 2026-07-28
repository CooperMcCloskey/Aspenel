import type { LoadedBranch } from "$lib/bindings";
import type { Draft } from "immer";

export type WithoutTypeDiscriminator<T> = T extends any ? Omit<T, "type"> : never;
export type Mutable<T> = Draft<T>;

export function isLoadedBranch(arg: any): arg is LoadedBranch {
  return arg && typeof arg === "object" && "branch" in arg;
}