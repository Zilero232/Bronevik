import type { inferParserType } from 'nuqs/server';

import type { QuickPreset } from '@/shared/lib';

import type { MAP_FILTER_PARSERS } from './map-filters.constants';

export const MAPS_PRESET_IDS = ['standard', 'small', 'medium', 'large', 'pinned'] as const;

export const MAPS_PRESETS: QuickPreset<inferParserType<typeof MAP_FILTER_PARSERS>, (typeof MAPS_PRESET_IDS)[number]>[] = [
  { id: 'standard', patch: { modes: ['standard'] } },
  { id: 'small', patch: { size: ['small'] } },
  { id: 'medium', patch: { size: ['medium'] } },
  { id: 'large', patch: { size: ['large'] } },
  { id: 'pinned', patch: { pinned: true } }
];
