import { useTranslations } from 'next-intl';

import { SegmentedControl, Select } from '@/ui-kit';

import type { StatsFiltersProps } from './StatsFilters.types';

import s from './StatsFilters.module.scss';

export const StatsFilters = ({ filters }: StatsFiltersProps) => {
  const t = useTranslations('mapStats.filters');

  return (
    <div className={s.root}>
      <SegmentedControl
        aria-label={t('mode')}
        className={s.modes}
        options={filters.modeOptions}
        size='sm'
        value={filters.mode}
        onChange={filters.onModeChange}
      />
      <Select className={s.tier} items={filters.tierItems} label={t('tier')} value={filters.tierValue} onValueChange={filters.onTierChange} />
    </div>
  );
};
