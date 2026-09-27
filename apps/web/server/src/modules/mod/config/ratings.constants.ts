export const MOD_RATINGS_READ = {
  throttle: { limit: 60, ttl: 60_000 },
  cacheTtlMs: 30_000,
  overviewKey: 'mod:ratings:overview:',
  tanksKey: 'mod:ratings:tanks:',
  statsMode: 'random',
  period: 'overall',
  maxMarksOnGun: 3,
  maxMastery: 4
} as const;
