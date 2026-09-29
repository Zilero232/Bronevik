import type { inferParserType } from 'nuqs/server';

import type { QuickPreset } from '@/shared/lib';

import { VEHICLE_FILTER_PARSERS } from '@/features/tank/filter-vehicles';

import { TANKS_QUERY_PARSERS } from './tanks-view.constants';

export const TANKS_PRESET_PARSERS = { ...VEHICLE_FILTER_PARSERS, ...TANKS_QUERY_PARSERS };

export const TANKS_PRESET_IDS = ['top10', 'tier10', 'tier8', 'tiers6to8', 'premium', 'researchable', 'collector', 'pinned'] as const;

export const TANKS_PRESETS: QuickPreset<inferParserType<typeof TANKS_PRESET_PARSERS>, (typeof TANKS_PRESET_IDS)[number]>[] = [
  { id: 'top10', patch: { top: true } },
  { id: 'tier10', patch: { tiers: [10] } },
  { id: 'tier8', patch: { tiers: [8] } },
  { id: 'tiers6to8', patch: { tiers: [6, 7, 8] } },
  { id: 'premium', patch: { statuses: ['premium'] } },
  { id: 'researchable', patch: { statuses: ['researchable'] } },
  { id: 'collector', patch: { statuses: ['collector'] } },
  { id: 'pinned', patch: { pinned: true } }
];
