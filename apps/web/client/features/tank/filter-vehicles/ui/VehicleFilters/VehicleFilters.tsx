'use client';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { clsx } from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, IconFilter, SegmentedControl } from '@/ui-kit';

import type { VehicleFiltersProps } from './VehicleFilters.types';

import { PREMIUM_FILTERS, VEHICLE_FILTER_ICON, VEHICLE_TIERS } from '../../config';
import { useVehicleFilters } from '../../model/hooks';

import s from './VehicleFilters.module.scss';

export const VehicleFilters = ({ withPremium = true, className }: VehicleFiltersProps) => {
  const t = useTranslations('tanks.filters');
  const { filters, isActive, setFilters, reset } = useVehicleFilters();

  return (
    <div className={clsx(s.root, className)}>
      <IconFilter
        aria-label={t('tier')}
        kind='tier'
        options={VEHICLE_TIERS}
        size='sm'
        value={filters.tiers}
        onChange={(tiers) => setFilters({ tiers })}
      />
      <IconFilter
        aria-label={t('type')}
        kind='class'
        options={TANK_CLASSES}
        size='sm'
        value={filters.types}
        onChange={(types) => setFilters({ types })}
      />
      <IconFilter
        aria-label={t('nation')}
        kind='nation'
        options={NATIONS}
        size='sm'
        value={filters.nations}
        onChange={(nations) => setFilters({ nations })}
      />
      {withPremium && (
        <SegmentedControl
          aria-label={t('premium')}
          options={PREMIUM_FILTERS.map((value) => ({ value, label: t(`premiumOptions.${value}`) }))}
          size='sm'
          value={filters.premium}
          onChange={(premium) => setFilters({ premium })}
        />
      )}
      {isActive && (
        <Button size='sm' variant='ghost' onClick={reset}>
          <RotateCcw size={VEHICLE_FILTER_ICON.reset} />
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
