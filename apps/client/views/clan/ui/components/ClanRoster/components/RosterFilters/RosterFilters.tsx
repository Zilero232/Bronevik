'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, SegmentedControl } from '@/ui-kit';

import type { InactiveFilter, RoleFilter } from '../../../../../lib/roster';
import type { RosterFiltersProps } from './RosterFilters.types';

import { INACTIVE_FILTERS, ROLE_FILTERS } from '../../../../../config';

import s from './RosterFilters.module.scss';

export const RosterFilters = ({ role, idle, isFiltered, onRoleChange, onIdleChange, onReset }: RosterFiltersProps) => {
  const t = useTranslations('clans.roster.filters');

  return (
    <div className={s.root}>
      <div className={s.group}>
        <span className={s.label}>{t('role')}</span>
        <SegmentedControl<RoleFilter>
          aria-label={t('role')}
          className={s.control}
          options={ROLE_FILTERS.map((value) => ({ value, label: t(`roles.${value}`) }))}
          size='sm'
          value={role}
          onChange={onRoleChange}
        />
      </div>
      <div className={s.group}>
        <span className={s.label}>{t('idle')}</span>
        <SegmentedControl<InactiveFilter>
          aria-label={t('idle')}
          className={s.control}
          options={INACTIVE_FILTERS.map((value) => ({ value, label: value === 'all' ? t('idleAll') : t('idleDays', { days: Number(value) }) }))}
          size='sm'
          value={idle}
          onChange={onIdleChange}
        />
      </div>
      {isFiltered && (
        <Button className={s.reset} size='sm' variant='ghost' onClick={onReset}>
          <X size={14} />
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
