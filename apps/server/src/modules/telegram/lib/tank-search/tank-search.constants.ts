export const TANK_SEARCH = {
  rank: { exact: 0, prefix: 1, contains: 2 },
  stripped: /[\s.\-_]+/gu
} as const;
