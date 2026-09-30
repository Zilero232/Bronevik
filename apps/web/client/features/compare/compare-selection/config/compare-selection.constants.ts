import { COMPARE } from '@otmetki/schemas';

import { ROUTES, STORAGE_KEYS } from '@/shared/constants';

import type { CompareSelection } from '../lib/compare-items';

export const COMPARE_SELECTION = {
  storageKey: STORAGE_KEYS.compareSelection,
  limit: 10,
  iconSize: 16
} as const;

export const COMPARE_KINDS = ['tank', 'player'] as const;

export const COMPARE_TARGET = {
  tank: { route: ROUTES.tanks.compare, max: COMPARE.maxTanks },
  player: { route: ROUTES.players.compare, max: COMPARE.maxPlayers }
} as const;

export const COMPARE_TANK_KEYS = ['tankId', 'name', 'shortName', 'slug', 'nation', 'type', 'tier', 'isPremium', 'images'] as const;

export const NO_COMPARE_SELECTION: CompareSelection = { tank: [], player: [], active: 'tank' };
