import { PAGINATION } from '@otmetki/schemas';

export const REPLAY_SORTS = ['recent', 'damage', 'xp', 'views'] as const;

export const REPLAY_RESULTS = ['win', 'loss', 'draw'] as const;

export const REPLAY_TABS = ['all', 'mine'] as const;

export const REPLAY_LIST = {
  pageSize: PAGINATION.defaultLimit,
  defaultSort: 'recent',
  defaultTab: 'all',
  anyValue: 'any',
  playerDebounceMs: 400,
  slugPattern: /^[\w-]{1,64}$/,
  hiddenModes: ['bootcamp', 'maps_training'],
  clanPattern: /^[\w-]{1,5}$/,
  chipItems: 2
} as const;

export const REPLAY_TIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const REPLAY_MINIMUMS = ['minDamage', 'minAssist', 'minBlocked', 'minFrags'] as const;

export const REPLAY_MINIMUM_STEP = {
  minDamage: 500,
  minAssist: 500,
  minBlocked: 500,
  minFrags: 1
} as const satisfies Record<(typeof REPLAY_MINIMUMS)[number], number>;

export const REPLAY_CARD = {
  figures: [
    { id: 'damage', key: 'damageDealt' },
    { id: 'assist', key: 'damageAssisted' },
    { id: 'frags', key: 'frags' }
  ]
} as const;
