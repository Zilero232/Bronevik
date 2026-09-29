import type { inferParserType } from 'nuqs/server';

import type { QuickPreset } from '@/shared/lib';

import { VEHICLE_FILTER_PARSERS } from '@/features/tank/filter-vehicles';

import { MARKS_URL_PARSERS } from './marks-url.constants';

export const MARKS_PRESET_PARSERS = { ...VEHICLE_FILTER_PARSERS, ...MARKS_URL_PARSERS };

export const MARKS_PRESET_IDS = ['tier10', 'tier8', 'tiers6to8', 'premium', 'regular', 'easiest', 'rising', 'pinned'] as const;

export const MARKS_PRESETS: QuickPreset<inferParserType<typeof MARKS_PRESET_PARSERS>, (typeof MARKS_PRESET_IDS)[number]>[] = [
  { id: 'tier10', patch: { tiers: [10] } },
  { id: 'tier8', patch: { tiers: [8] } },
  { id: 'tiers6to8', patch: { tiers: [6, 7, 8] } },
  { id: 'premium', patch: { premium: 'premium' } },
  { id: 'regular', patch: { premium: 'regular' } },
  { id: 'easiest', patch: { sort: 'p95', order: 'asc' } },
  { id: 'rising', patch: { sort: 'p95Change30d', order: 'desc' } },
  { id: 'pinned', patch: { pinned: true } }
];
