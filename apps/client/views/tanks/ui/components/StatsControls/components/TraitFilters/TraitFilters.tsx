'use client';

import type { TankStatus } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { Select, ToggleChips } from '@/ui-kit';

import type { RoleChoice } from '../../../../../model/hooks';

import { useTraitFilters } from '../../../../../model/hooks';

import s from './TraitFilters.module.scss';

export const TraitFilters = () => {
  const t = useTranslations('tankTraits');
  const { statuses, statusOptions, role, roleItems, onStatusesChange, onRoleChange } = useTraitFilters();

  return (
    <div className={s.root}>
      <ToggleChips<TankStatus> aria-label={t('status.label')} options={statusOptions} size='sm' value={statuses} onChange={onStatusesChange} />
      <Select<RoleChoice> className={s.role} items={roleItems} label={t('role.label')} value={role} onValueChange={onRoleChange} />
    </div>
  );
};
