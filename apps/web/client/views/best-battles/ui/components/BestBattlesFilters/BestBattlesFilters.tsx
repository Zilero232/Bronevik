'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { BestBattleMetric, BestBattlePeriod } from '@/entities/battle/best-battle';

import { BattleMedal } from '@/entities/battle/best-battle';
import { TankPicker } from '@/features/tank/pick-tank';
import { Button, SegmentedControl, Select, ToggleChips } from '@/ui-kit';

import { BEST_BATTLES_VIEW } from '../../../config';
import { useBestBattlesFilters } from '../../../model/hooks';

import s from './BestBattlesFilters.module.scss';

export const BestBattlesFilters = () => {
  const t = useTranslations('bestBattles.filters');
  const filters = useBestBattlesFilters();

  return (
    <div className={s.root} role='search'>
      <div className={s.row}>
        <SegmentedControl<BestBattlePeriod>
          aria-label={t('period')}
          options={filters.periodOptions}
          size='sm'
          value={filters.period}
          onChange={filters.onPeriodChange}
        />
        <Select<BestBattleMetric>
          className={s.select}
          items={filters.metricItems}
          label={t('metric')}
          value={filters.metric}
          onValueChange={filters.onMetricChange}
        />
        <TankPicker
          className={s.tank}
          label={t('tank')}
          placeholder={t('tankPlaceholder')}
          value={filters.vehicle}
          onChange={filters.onVehicleChange}
        />
        <Select className={s.select} items={filters.mapItems} label={t('map')} value={filters.mapValue} onValueChange={filters.onMapChange} />
        {filters.isFiltered && (
          <Button className={s.reset} size='sm' variant='ghost' onClick={filters.onReset}>
            <X size={14} />
            {t('reset')}
          </Button>
        )}
      </div>
      {filters.medals.length > 0 && (
        <div className={s.medals}>
          <span className={s.label}>{t('medals')}</span>
          <ToggleChips
            options={filters.medals.map((medal) => ({
              value: medal.name,
              label: medal.title,
              title: t('medalBattles', { count: medal.battles }),
              icon: <BattleMedal medal={medal} size={BEST_BATTLES_VIEW.chipMedalSize} />
            }))}
            aria-label={t('medals')}
            size='sm'
            value={filters.medalValue}
            onChange={filters.onMedalsChange}
          />
        </div>
      )}
    </div>
  );
};
