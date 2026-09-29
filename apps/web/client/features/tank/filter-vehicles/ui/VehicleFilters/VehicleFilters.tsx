'use client';

import type { TankStatus } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { FilterBar, FilterField, IconFilter, Select, TierPicker, ToggleChips } from '@/ui-kit';

import type { RoleChoice } from '../../model/hooks';
import type { VehicleFiltersProps } from './VehicleFilters.types';

import { VEHICLE_TIERS } from '../../config';
import { useVehicleFiltersView } from '../../model/hooks';

export const VehicleFilters = ({
  withStatuses = true,
  withRoles = true,
  label,
  leading,
  children,
  extraActive,
  onExtraReset,
  ...bar
}: VehicleFiltersProps) => {
  const t = useTranslations('tanks.filters');
  const tTraits = useTranslations('tankTraits');
  const { filters, active, statusOptions, roleItems, role, onReset, onTiersChange, onTypesChange, onNationsChange, onStatusesChange, onRoleChange } =
    useVehicleFiltersView({ extraActive, onExtraReset });

  return (
    <FilterBar active={active} label={label ?? t('label')} onReset={onReset} {...bar}>
      {leading}
      <FilterField count={filters.tiers.length} label={t('tier')}>
        <TierPicker aria-label={t('tier')} options={VEHICLE_TIERS} value={filters.tiers} onChange={onTiersChange} />
      </FilterField>
      <FilterField count={filters.types.length} label={t('type')}>
        <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} value={filters.types} onChange={onTypesChange} />
      </FilterField>
      <FilterField count={filters.nations.length} label={t('nation')}>
        <IconFilter aria-label={t('nation')} kind='nation' options={NATIONS} value={filters.nations} onChange={onNationsChange} />
      </FilterField>
      {withStatuses && (
        <FilterField count={filters.statuses.length} label={tTraits('status.label')}>
          <ToggleChips<TankStatus>
            aria-label={tTraits('status.label')}
            options={statusOptions}
            value={filters.statuses}
            onChange={onStatusesChange}
          />
        </FilterField>
      )}
      {withRoles && (
        <FilterField label={tTraits('role.label')} size='lg'>
          <Select<RoleChoice> aria-label={tTraits('role.label')} items={roleItems} value={role} onValueChange={onRoleChange} />
        </FilterField>
      )}
      {children}
    </FilterBar>
  );
};
