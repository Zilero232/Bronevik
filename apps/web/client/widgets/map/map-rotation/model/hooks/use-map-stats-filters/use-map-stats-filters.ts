'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import type { SegmentedOption } from '@/ui-kit';

import type { MapStatsMode } from '../../../api';

import { MAP_STATS, MAP_STATS_FILTERS } from '../../../config';

export const useMapStatsFilters = () => {
  const tm = useTranslations('mapStats.modes');
  const [{ tier, mode }, setParams] = useQueryStates(MAP_STATS_FILTERS, { history: 'replace' });

  const modeOptions: SegmentedOption<MapStatsMode>[] = MAP_STATS.modes.map((value) => ({ value, label: tm(value) }));

  return {
    tier,
    mode,
    tierValue: tier === MAP_STATS.allTiers ? [] : [tier],
    tierOptions: MAP_STATS.tiers.filter((value) => value !== MAP_STATS.allTiers),
    modeOptions,
    activeCount: Number(tier !== MAP_STATS.allTiers),
    onTierChange: (next: number[]) => void setParams({ tier: MAP_STATS.tiers.find((entry) => entry === next[0]) ?? MAP_STATS.allTiers }),
    onReset: () => void setParams({ tier: MAP_STATS.allTiers }),
    onModeChange: (value: MapStatsMode) => void setParams({ mode: value })
  };
};
