import type { LoadedBranch } from "$lib/bindings";

export type WithoutTypeDiscriminator<T> = T extends any ? Omit<T, "type"> : never;

export function isLoadedBranch(arg: any): arg is LoadedBranch {
  return arg && typeof arg === "object" && "branch" in arg;
}