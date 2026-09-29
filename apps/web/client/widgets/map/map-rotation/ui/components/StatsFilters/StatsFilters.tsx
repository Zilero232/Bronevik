'use client';

import { useTranslations } from 'next-intl';

import { FilterBar, FilterField, SegmentedControl, TierPicker } from '@/ui-kit';

import { useMapStatsFilters } from '../../../model/hooks';

export const StatsFilters = () => {
  const t = useTranslations('mapStats.filters');
  const { mode, modeOptions, tierOptions, tierValue, activeCount, onModeChange, onTierChange, onReset } = useMapStatsFilters();

  return (
    <FilterBar activeCount={activeCount} onReset={onReset}>
      <FilterField label={t('mode')}>
        <SegmentedControl aria-label={t('mode')} options={modeOptions} value={mode} onChange={onModeChange} />
      </FilterField>
      <FilterField count={tierValue.length} label={t('tier')}>
        <TierPicker aria-label={t('tier')} mode='single' options={tierOptions} value={tierValue} onChange={onTierChange} />
      </FilterField>
    </FilterBar>
  );
};
