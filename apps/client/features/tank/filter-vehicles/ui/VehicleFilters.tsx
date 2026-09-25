'use client';

import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES, toRoman } from '@bronevik/icons';
import { clsx } from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, SegmentedControl, ToggleChips } from '@/ui-kit';

import type { VehicleFiltersProps } from './VehicleFilters.types';

import { PREMIUM_FILTERS, VEHICLE_TIERS } from '../config';
import { useVehicleFilters } from '../model/hooks';
import { FilterRow } from './components';

import s from './VehicleFilters.module.scss';

export const VehicleFilters = ({ withPremium = true, className }: VehicleFiltersProps) => {
  const t = useTranslations('tanks.filters');
  const tGame = useTranslations('game');
  const { filters, isActive, setFilters, reset } = useVehicleFilters();

  return (
    <div className={clsx(s.root, className)}>
      <FilterRow label={t('tier')}>
        <ToggleChips
          aria-label={t('tier')}
          options={VEHICLE_TIERS.map((tier) => ({ value: String(tier), label: toRoman(tier) }))}
          size='sm'
          value={filters.tiers.map(String)}
          onChange={(tiers) => setFilters({ tiers: tiers.map(Number) })}
        />
      </FilterRow>
      <FilterRow label={t('type')}>
        <ToggleChips
          options={TANK_CLASSES.map((type) => {
            const Icon = TANK_CLASS_ICONS[type];

            return { value: type, label: <Icon size={18} strokeWidth={1.75} />, title: tGame(`classes.${type}`) };
          })}
          aria-label={t('type')}
          size='sm'
          value={filters.types}
          onChange={(types) => setFilters({ types })}
        />
      </FilterRow>
      <FilterRow label={t('nation')}>
        <ToggleChips
          options={NATIONS.map((nation) => {
            const Icon = NATION_ICONS[nation];

            return { value: nation, label: <Icon palette='color' size={20} />, title: tGame(`nations.${nation}`) };
          })}
          aria-label={t('nation')}
          size='sm'
          value={filters.nations}
          onChange={(nations) => setFilters({ nations })}
        />
      </FilterRow>
      <div className={s.foot}>
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
            <RotateCcw size={14} />
            {t('reset')}
          </Button>
        )}
      </div>
    </div>
  );
};
