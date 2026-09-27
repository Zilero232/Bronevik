export const PLAYLIST_RULES = {
  closeToMarkPercent: 5,
  longUnplayedDays: 14,
  lowWinRate: 47,
  lowWinRateMinBattles: 30,
  minTier: 5,
  jitter: 0.75,
  weights: { closeToMark: 3, firstWin: 2, longUnplayed: 1, lowWinRate: 1.5, mission: 2 }
} as const;

export const FIRST_WIN = {
  resetHour: 4,
  modes: ['random'],
  randomBattleType: '1'
} as const;

export const PLAYLIST_SEED = {
  dayMs: 86_400_000
} as const;
