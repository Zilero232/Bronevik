export const AGGREGATES = {
  referenceCacheTtlMs: 15 * 60_000,
  serverStatsModes: ['random', 'all'],
  ratingModes: ['random', 'all']
} as const;
