import { GAME_MODE_BONUS_TYPES } from '../../../common/lib';

export const BEST_BATTLE_PERIODS = ['day', 'week', 'month'] as const;

export const BEST_BATTLE_METRICS = ['damage', 'assisted', 'spotted', 'frags', 'xp', 'blocked'] as const;

export const BEST_BATTLE_SOURCES = ['mod', 'replay'] as const;

export const BEST_BATTLE_METRIC_COLUMN = {
  damage: 'damage',
  assisted: 'assisted',
  spotted: 'spotted',
  frags: 'frags',
  xp: 'xp',
  blocked: 'blocked'
} as const satisfies Record<(typeof BEST_BATTLE_METRICS)[number], string>;

export const BEST_BATTLES = {
  defaultPeriod: 'week',
  defaultMetric: 'damage',
  defaultLimit: 25,
  maxLimit: 50,
  maxRank: 500,
  periodDays: { day: 1, week: 7, month: 30 },
  battleTypes: GAME_MODE_BONUS_TYPES.random.map(String),
  feedCacheMs: 120_000,
  facetsCacheMs: 300_000,
  facetMedals: 12,
  facetTanks: 12,
  facetArenas: 12
} as const;
