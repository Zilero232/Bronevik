export const ARMOR_SOURCE = {
  repo: 'unicum-gg/wot.models',
  url: 'https://github.com/unicum-gg/wot.models/tree/Lesta',
  shortCommit: 7
} as const;

export const ARMOR_QUOTA = {
  meter: 'armor3d',
  resetFormat: { day: 'numeric', month: 'long' } satisfies Intl.DateTimeFormatOptions
} as const;
