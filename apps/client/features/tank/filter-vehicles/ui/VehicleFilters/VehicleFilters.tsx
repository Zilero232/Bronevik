'use client';

import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES, toRoman } from '@otmetki/icons';
import { clsx } from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, SegmentedControl, ToggleChips } from '@/ui-kit';

import type { VehicleFiltersProps } from './VehicleFilters.types';

import { PREMIUM_FILTERS, VEHICLE_FILTER_ICON, VEHICLE_TIERS } from '../../config';
import { useVehicleFilters } from '../../model/hooks';

import s from './VehicleFilters.module.scss';

export const VehicleFilters = ({ withPremium = true, className }: VehicleFiltersProps) => {
  const t = useTranslations('tanks.filters');
  const tGame = useTranslations('game');
  const { filters, isActive, setFilters, reset } = useVehicleFilters();

  return (
    <div className={clsx(s.root, className)}>
      <ToggleChips
        aria-label={t('tier')}
        options={VEHICLE_TIERS.map((tier) => ({ value: String(tier), label: toRoman(tier) }))}
        size='sm'
        value={filters.tiers.map(String)}
        onChange={(tiers) => setFilters({ tiers: tiers.map(Number) })}
      />
      <ToggleChips
        options={TANK_CLASSES.map((type) => {
          const Icon = TANK_CLASS_ICONS[type];

          return { value: type, label: <Icon size={VEHICLE_FILTER_ICON.class} />, title: tGame(`classes.${type}`) };
        })}
        aria-label={t('type')}
        size='sm'
        value={filters.types}
        onChange={(types) => setFilters({ types })}
      />
      <ToggleChips
        options={NATIONS.map((nation) => {
          const Icon = NATION_ICONS[nation];

          return { value: nation, label: <Icon palette='color' size={VEHICLE_FILTER_ICON.nation} />, title: tGame(`nations.${nation}`) };
        })}
        aria-label={t('nation')}
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
