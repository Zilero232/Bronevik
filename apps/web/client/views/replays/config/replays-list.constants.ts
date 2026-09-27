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
  hiddenModes: ['bootcamp', 'maps_training']
} as const;

export const REPLAY_CARD = {
  figures: [
    { id: 'damage', key: 'damageDealt' },
    { id: 'assist', key: 'damageAssisted' },
    { id: 'frags', key: 'frags' }
  ]
} as const;
