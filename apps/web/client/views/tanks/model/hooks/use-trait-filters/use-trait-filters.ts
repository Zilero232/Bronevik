'use client';

import type { LearningDifficulty, TankStatus } from '@otmetki/schemas';

import { LEARNING_DIFFICULTIES, TANK_ROLES, TANK_STATUSES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { SelectItem } from '@/ui-kit';

import type { RoleChoice } from './use-trait-filters.types';

import { ANY_ROLE } from '../../../config';
import { useTanksState } from '../use-tanks-state';

export const useTraitFilters = () => {
  const t = useTranslations('tankTraits');
  const [{ statuses, roles, difficulties }, setState] = useTanksState();

  const statusOptions = TANK_STATUSES.map((value) => ({ value, label: t(`status.${value}`) }));
  const difficultyOptions = LEARNING_DIFFICULTIES.map((value) => ({ value, label: t(`difficulty.${value}`) }));
  const roleItems: SelectItem<RoleChoice>[] = [
    { value: ANY_ROLE, label: t('role.any') },
    ...TANK_ROLES.map((value) => ({ value, label: t(`role.${value}`) }))
  ];

  const role = roles[0] ?? ANY_ROLE;

  const onStatusesChange = (next: TankStatus[]) => {
    void setState({ statuses: next.length > 0 ? next : null });
  };

  const onDifficultiesChange = (next: LearningDifficulty[]) => {
    void setState({ difficulties: next.length > 0 ? next : null });
  };

  const onRoleChange = (next: RoleChoice) => {
    void setState({ roles: next === ANY_ROLE ? null : [next] });
  };

  return {
    statuses,
    statusOptions,
    difficulties,
    difficultyOptions,
    role,
    roleItems,
    onStatusesChange,
    onDifficultiesChange,
    onRoleChange
  };
};
