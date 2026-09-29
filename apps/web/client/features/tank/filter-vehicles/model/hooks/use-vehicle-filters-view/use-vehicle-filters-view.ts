'use client';

import type { TankRole } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import type { SelectItem } from '@/ui-kit';

import type { RoleChoice } from './use-vehicle-filters-view.types';

import { ANY_ROLE, VEHICLE_KINDS } from '../../../config';
import { rolesForTypes } from '../../../lib';
import { useVehicleFilters } from '../use-vehicle-filters';

export const useVehicleFiltersView = () => {
  const t = useTranslations('tanks.filters');
  const tTraits = useTranslations('tankTraits');
  const { filters, isActive, setFilters, reset } = useVehicleFilters();

  const kindOptions = VEHICLE_KINDS.map((value) => ({ value, label: t(`premiumOptions.${value}`) }));
  const roleItems: SelectItem<RoleChoice>[] = [
    { value: ANY_ROLE, label: tTraits('role.any') },
    ...rolesForTypes(filters.types).map((value: TankRole) => ({ value, label: tTraits(`role.${value}`) }))
  ];

  return {
    filters,
    isActive,
    kindOptions,
    roleItems,
    role: filters.roles[0] ?? ANY_ROLE,
    setFilters,
    reset,
    onRoleChange: (next: RoleChoice) => void setFilters({ roles: next === ANY_ROLE ? null : [next] })
  };
};
