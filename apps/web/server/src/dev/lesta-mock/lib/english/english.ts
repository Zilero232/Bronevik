export const englishName = (key: string): string =>
  key
    .replace(/^[\d_]+/u, '')
    .replaceAll(/([a-z])([A-Z])/gu, '$1 $2')
    .split(/[_\s]+/u)
    .filter((word) => word.length > 0)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
