'use client';

import type { RatingKind, RatingPeriod } from '@otmetki/schemas';

import { TANK_CLASSES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { FilterBar, FilterField, IconFilter, SegmentedControl, Select, TierPicker } from '@/ui-kit';

import { useTopFilters } from '../../../model/hooks';

export const TopFilters = () => {
  const t = useTranslations('top');
  const {
    metrics,
    periods,
    metric,
    period,
    tiers,
    types,
    active,
    tank,
    hasTank,
    onMetricChange,
    onPeriodChange,
    onTiersChange,
    onTypesChange,
    onTankChange,
    onReset
  } = useTopFilters();

  return (
    <FilterBar active={active} variant='bare' onReset={onReset}>
      {metrics.length > 0 && (
        <FilterField label={t('metric')} size='md'>
          <Select<RatingKind> items={metrics} value={metric} onValueChange={onMetricChange} />
        </FilterField>
      )}
      <FilterField label={t('period')}>
        <SegmentedControl<RatingPeriod> aria-label={t('period')} options={periods} value={period} onChange={onPeriodChange} />
      </FilterField>
      <FilterField count={tiers.length} label={t('tier')}>
        <TierPicker aria-label={t('tier')} mode='single' value={tiers} onChange={onTiersChange} />
      </FilterField>
      <FilterField count={types.length} label={t('type')}>
        <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} value={types} onChange={onTypesChange} />
      </FilterField>
      {hasTank && (
        <FilterField label={t('tank')} size='lg'>
          <TankPicker placeholder={t('tankPlaceholder')} value={tank} onChange={onTankChange} />
        </FilterField>
      )}
    </FilterBar>
  );
};
