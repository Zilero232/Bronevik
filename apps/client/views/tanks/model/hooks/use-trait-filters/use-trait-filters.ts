'use client';

import type { TankStatus } from '@otmetki/schemas';

import { TANK_ROLES, TANK_STATUSES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { SelectItem } from '@/ui-kit';

import type { RoleChoice } from './use-trait-filters.types';

import { ANY_ROLE } from '../../../config';
import { useTanksState } from '../use-tanks-state';

export const useTraitFilters = () => {
  const t = useTranslations('tankTraits');
  const [{ statuses, roles }, setState] = useTanksState();

  const statusOptions = TANK_STATUSES.map((value) => ({ value, label: t(`status.${value}`) }));
  const roleItems: SelectItem<RoleChoice>[] = [
    { value: ANY_ROLE, label: t('role.any') },
    ...TANK_ROLES.map((value) => ({ value, label: t(`role.${value}`) }))
  ];

  const role = roles[0] ?? ANY_ROLE;

  const onStatusesChange = (next: TankStatus[]) => {
    void setState({ statuses: next.length > 0 ? next : null });
  };

  const onRoleChange = (next: RoleChoice) => {
    void setState({ roles: next === ANY_ROLE ? null : [next] });
  };

  return { statuses, statusOptions, role, roleItems, onStatusesChange, onRoleChange };
};
