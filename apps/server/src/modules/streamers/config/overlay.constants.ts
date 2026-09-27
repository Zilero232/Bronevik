export const OVERLAY = {
  cacheTtlMs: 5_000,
  streamRefreshMs: 30_000,
  channelPrefix: 'otmetki:overlay:account:',
  publicPath: '/overlay/{publicKey}'
} as const;

export const OVERLAY_KIND_TO_DB = {
  session: 'session',
  wn8: 'wn8',
  moe: 'moe',
  damage: 'damage',
  win_rate: 'winRate',
  win_streak: 'winStreak',
  challenge: 'challenge',
  custom: 'custom'
} as const;

export const OVERLAY_KIND_FROM_DB = {
  session: 'session',
  wn8: 'wn8',
  moe: 'moe',
  damage: 'damage',
  winRate: 'win_rate',
  winStreak: 'win_streak',
  challenge: 'challenge',
  custom: 'custom'
} as const;
