export const ANALYTICS_PERIODS = ['d30', 'd90', 'y1', 'all'] as const;

export const ANALYTICS_GRANULARITIES = ['week', 'month'] as const;

export const PLAYLIST_REASONS = ['closeToMark', 'firstWin', 'longUnplayed', 'lowWinRate', 'mission'] as const;

export const BATTLE_MISTAKES = [
  'noDamage',
  'lowDamage',
  'lowSpotting',
  'lowAssist',
  'diedEarly',
  'lowAccuracy',
  'lowPenetration',
  'moeLoss'
] as const;

export const ANALYTICS_BATTLES_QUERY = {
  defaultLimit: 25,
  maxLimit: 100
} as const;

export const PLAYLIST = {
  freeSize: 5,
  plusSize: 10,
  freeReasons: ['closeToMark', 'firstWin', 'longUnplayed']
} as const satisfies { freeSize: number; plusSize: number; freeReasons: readonly (typeof PLAYLIST_REASONS)[number][] };

export const HONEST_RNG = {
  spread: 0.25,
  buckets: 10
} as const;
