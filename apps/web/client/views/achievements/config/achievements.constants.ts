import { TANK_CLASSES } from '@otmetki/icons';
import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server';

import type { BadgeTone } from '@/ui-kit';

import type { RarityTier } from '../model/achievements.types';

export const ACHIEVEMENTS_TABS = ['medals', 'tanks', 'collectors'] as const;

export const ACHIEVEMENT_SECTIONS = ['battle', 'epic', 'special', 'memorial', 'group', 'class', 'action', 'other'] as const;

export const MEDAL_SORTS = ['rarity', 'common', 'points'] as const;

export const TANK_RARITY_SORTS = ['rare', 'common'] as const;

export const ACHIEVEMENTS_PARAMS = {
  tab: parseAsStringLiteral(ACHIEVEMENTS_TABS).withDefault('medals'),
  section: parseAsString,
  sort: parseAsStringLiteral(MEDAL_SORTS).withDefault('rarity'),
  tier: parseAsInteger,
  type: parseAsStringLiteral(TANK_CLASSES),
  order: parseAsStringLiteral(TANK_RARITY_SORTS).withDefault('rare')
};

export const RARITY_TONE = {
  legendary: 'gold',
  epic: 'battle',
  rare: 'sky',
  uncommon: 'olive',
  common: 'neutral'
} as const satisfies Record<RarityTier, BadgeTone>;

export const ACHIEVEMENTS = {
  staleMs: 30 * 60_000,
  collectorsLimit: 100,
  medalSize: 40,
  anySection: 'all'
} as const;
