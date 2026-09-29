'use client';

import type { TankRole, TankStatus } from '@otmetki/schemas';

import { TANK_STATUSES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { SelectItem } from '@/ui-kit';

import type { RoleChoice } from './use-vehicle-filters-view.types';

import { ANY_ROLE } from '../../../config';
import { rolesForTypes } from '../../../lib';
import { useVehicleFilters } from '../use-vehicle-filters';

export const useVehicleFiltersView = () => {
  const tTraits = useTranslations('tankTraits');
  const { filters, isActive, setFilters, reset } = useVehicleFilters();

  const statusOptions = TANK_STATUSES.map((value) => ({ value, label: tTraits(`status.${value}`) }));
  const roleItems: SelectItem<RoleChoice>[] = [
    { value: ANY_ROLE, label: tTraits('role.any') },
    ...rolesForTypes(filters.types).map((value: TankRole) => ({ value, label: tTraits(`role.${value}`) }))
  ];

  return {
    filters,
    isActive,
    statusOptions,
    roleItems,
    role: filters.roles[0] ?? ANY_ROLE,
    setFilters,
    reset,
    onStatusesChange: (next: TankStatus[]) => void setFilters({ statuses: next.length > 0 ? next : null }),
    onRoleChange: (next: RoleChoice) => void setFilters({ roles: next === ANY_ROLE ? null : [next] })
  };
};
