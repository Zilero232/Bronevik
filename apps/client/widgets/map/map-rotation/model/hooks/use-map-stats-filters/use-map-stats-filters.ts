'use client';

import { useTranslations } from 'next-intl';
import { parseAsNumberLiteral, parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { SegmentedOption, SelectItem } from '@/ui-kit';

import type { MapStatsMode } from '../../../api';

import { MAP_STATS } from '../../../config';

const FILTER_PARSERS = {
  tier: parseAsNumberLiteral(MAP_STATS.tiers).withDefault(MAP_STATS.allTiers),
  mode: parseAsStringLiteral(MAP_STATS.modes).withDefault(MAP_STATS.defaultMode)
};

export const useMapStatsFilters = () => {
  const t = useTranslations('mapStats.filters');
  const tm = useTranslations('mapStats.modes');
  const [{ tier, mode }, setParams] = useQueryStates(FILTER_PARSERS, { history: 'replace' });

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
