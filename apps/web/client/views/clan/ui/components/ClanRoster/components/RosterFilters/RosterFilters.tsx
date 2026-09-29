'use client';

import { useTranslations } from 'next-intl';

import { FilterBar, FilterField, SegmentedControl } from '@/ui-kit';

import type { InactiveFilter, RoleFilter } from '../../../../../lib/roster';

import { INACTIVE_FILTERS, ROLE_FILTERS } from '../../../../../config';
import { useRosterFilters } from '../../../../../model/hooks';

export const RosterFilters = () => {
  const t = useTranslations('clans.roster.filters');
  const { role, idle, activeCount, onRoleChange, onIdleChange, onReset } = useRosterFilters();

  return (
    <FilterBar activeCount={activeCount} onReset={onReset}>
      <FilterField label={t('role')}>
        <SegmentedControl<RoleFilter>
          aria-label={t('role')}
          options={ROLE_FILTERS.map((value) => ({ value, label: t(`roles.${value}`) }))}
          value={role}
          onChange={onRoleChange}
        />
      </FilterField>
      <FilterField label={t('idle')}>
        <SegmentedControl<InactiveFilter>
          aria-label={t('idle')}
          options={INACTIVE_FILTERS.map((value) => ({ value, label: value === 'all' ? t('idleAll') : t('idleDays', { days: Number(value) }) }))}
          value={idle}
          onChange={onIdleChange}
        />
      </FilterField>
    </FilterBar>
  );
};
