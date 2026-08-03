export const stripSvgExtension = (name: string): string =>
  name.endsWith('.svg') ? name.substring(0, name.length - 4) : name;
