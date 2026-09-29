'use client';

import { useTranslations } from 'next-intl';

import type { BestBattleMetric, BestBattlePeriod } from '@/entities/battle/best-battle';

import { BattleMedal } from '@/entities/battle/best-battle';
import { TankPicker } from '@/features/tank/pick-tank';
import { FilterBar, FilterField, SegmentedControl, Select, ToggleChips } from '@/ui-kit';

import { BEST_BATTLES_VIEW } from '../../../config';
import { useBestBattlesFilters } from '../../../model/hooks';

export const BestBattlesFilters = () => {
  const t = useTranslations('bestBattles.filters');
  const filters = useBestBattlesFilters();

  return (
    <FilterBar active={filters.active} variant='bare' onReset={filters.onReset}>
      <FilterField label={t('period')}>
        <SegmentedControl<BestBattlePeriod>
          aria-label={t('period')}
          options={filters.periodOptions}
          value={filters.period}
          onChange={filters.onPeriodChange}
        />
      </FilterField>
      <FilterField label={t('metric')} size='md'>
        <Select<BestBattleMetric> items={filters.metricItems} value={filters.metric} onValueChange={filters.onMetricChange} />
      </FilterField>
      <FilterField label={t('tank')} size='lg'>
        <TankPicker placeholder={t('tankPlaceholder')} value={filters.vehicle} onChange={filters.onVehicleChange} />
      </FilterField>
      <FilterField label={t('map')} size='md'>
        <Select items={filters.mapItems} value={filters.mapValue} onValueChange={filters.onMapChange} />
      </FilterField>
      {filters.medals.length > 0 && (
        <FilterField count={filters.medalValue.length} label={t('medals')}>
          <ToggleChips
            options={filters.medals.map((medal) => ({
              value: medal.name,
              label: medal.title,
              title: t('medalBattles', { count: medal.battles }),
              icon: <BattleMedal medal={medal} size={BEST_BATTLES_VIEW.chipMedalSize} />
            }))}
            aria-label={t('medals')}
            value={filters.medalValue}
            onChange={filters.onMedalsChange}
          />
        </FilterField>
      )}
    </FilterBar>
  );
};
