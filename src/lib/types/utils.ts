export type WithoutTypeDiscriminator<T> = T extends any ? Omit<T, "type"> : never;
export type Size = {width: number, height: number}
export type Result<T> = {
  status: "ok"
  data: T
} | {
  status: "error",
  error: string
}

export function fitsContainer(container: Size, contained: Size | undefined): boolean{
  return container.width > (contained?.width ?? Infinity) && container.height > (contained?.height ?? Infinity);
}

export const objectEntries = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][];
export const objectFromEntries = <K extends PropertyKey, V>(e: [K, V][]) => Object.fromEntries(e) as Record<K, V>;
