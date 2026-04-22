import type { Branch } from "./rustTypes/Branch";

export type WithoutTypeDiscriminator<T> = T extends any ? Omit<T, "type"> : never;