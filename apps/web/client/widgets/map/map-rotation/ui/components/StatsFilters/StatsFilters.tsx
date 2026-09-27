'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl, Select } from '@/ui-kit';

import { useMapStatsFilters } from '../../../model/hooks';

import s from './StatsFilters.module.scss';

export const StatsFilters = () => {
  const t = useTranslations('mapStats.filters');
  const { mode, modeOptions, tierItems, tierValue, onModeChange, onTierChange } = useMapStatsFilters();

  return (
    <div className={s.root}>
      <SegmentedControl aria-label={t('mode')} className={s.modes} options={modeOptions} size='sm' value={mode} onChange={onModeChange} />
      <Select className={s.tier} items={tierItems} label={t('tier')} value={tierValue} onValueChange={onTierChange} />
    </div>
  );
};
