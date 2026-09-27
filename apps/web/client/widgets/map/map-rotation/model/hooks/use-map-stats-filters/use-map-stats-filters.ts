'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import type { SegmentedOption, SelectItem } from '@/ui-kit';

import type { MapStatsMode } from '../../../api';

import { MAP_STATS, MAP_STATS_FILTERS } from '../../../config';

export const useMapStatsFilters = () => {
  const t = useTranslations('mapStats.filters');
  const tm = useTranslations('mapStats.modes');
  const [{ tier, mode }, setParams] = useQueryStates(MAP_STATS_FILTERS, { history: 'replace' });

  const tierItems: SelectItem[] = MAP_STATS.tiers.map((value) => ({
    value: String(value),
    label: value === MAP_STATS.allTiers ? t('allTiers') : t('tierItem', { tier: value })
  }));

  const modeOptions: SegmentedOption<MapStatsMode>[] = MAP_STATS.modes.map((value) => ({ value, label: tm(value) }));

  return {
    tier,
    mode,
    tierValue: String(tier),
    tierItems,
    modeOptions,
    onTierChange: (value: string) => {
      const next = MAP_STATS.tiers.find((entry) => String(entry) === value) ?? MAP_STATS.allTiers;

      void setParams({ tier: next });
    },
    onModeChange: (value: MapStatsMode) => void setParams({ mode: value })
  };
};
