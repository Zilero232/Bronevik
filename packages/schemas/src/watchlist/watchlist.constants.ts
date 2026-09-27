export const WATCHLIST_DIGESTS = ['off', 'hourly', 'daily', 'weekly'] as const;

export const WATCHLIST_PERIODS = ['24h', '7d'] as const;

export const WATCHLIST = {
  plusDigests: ['hourly'],
  defaultDigest: 'off',
  lapsedPlusDigest: 'daily',
  defaultPeriod: '24h',
  digestHours: { hourly: 1, daily: 24, weekly: 168 },
  periodHours: { '24h': 24, '7d': 168 },
  digestTopPlayers: 5
} as const;
