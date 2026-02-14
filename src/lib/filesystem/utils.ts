export function joinPath(base: string, part: string): string {
  return `${base}/${part}`.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}