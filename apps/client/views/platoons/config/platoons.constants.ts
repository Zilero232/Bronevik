export const PLATOON_TIERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] as const;

export const PLATOON_MODES = ['random', 'ranked', 'onslaught', 'stronghold', 'frontline', 'event'] as const;

export const PLATOON_VOICE = ['any', 'yes', 'no'] as const;

export const PLATOON_BOARD = {
  pageSize: 20,
  nowTickMs: 60_000,
  wn8DebounceMs: 400,
  anyMode: 'any',
  maxTanks: 20,
  expiresOptions: [1, 2, 3, 6, 12, 24],
  defaultExpiresInHours: 3
} as const;

export const PLATOON_TIME_FORMAT = {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
} as const satisfies Intl.DateTimeFormatOptions;
