'use client';

import type { TankStatus } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { clsx } from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, IconFilter, Select, ToggleChips } from '@/ui-kit';

import type { RoleChoice } from '../../model/hooks';
import type { VehicleFiltersProps } from './VehicleFilters.types';

import { VEHICLE_FILTER_ICON, VEHICLE_TIERS } from '../../config';
import { useVehicleFiltersView } from '../../model/hooks';

import s from './VehicleFilters.module.scss';

export const VehicleFilters = ({ withStatuses = true, withRoles = true, className }: VehicleFiltersProps) => {
  const t = useTranslations('tanks.filters');
  const tTraits = useTranslations('tankTraits');
  const { filters, isActive, statusOptions, roleItems, role, setFilters, reset, onStatusesChange, onRoleChange } = useVehicleFiltersView();

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
      {withStatuses && (
        <ToggleChips<TankStatus>
          aria-label={tTraits('status.label')}
          options={statusOptions}
          size='sm'
          value={filters.statuses}
          onChange={onStatusesChange}
        />
      )}
      {withRoles && (
        <Select<RoleChoice> aria-label={tTraits('role.label')} className={s.role} items={roleItems} value={role} onValueChange={onRoleChange} />
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
