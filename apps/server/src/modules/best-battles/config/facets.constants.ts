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
