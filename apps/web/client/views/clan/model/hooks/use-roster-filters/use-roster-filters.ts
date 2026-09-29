'use client';

import { useQueryStates } from 'nuqs';

import type { InactiveFilter, RoleFilter } from '../../../lib/roster';

import { ROSTER_FILTER_PARSERS } from '../../../config';

export const useRosterFilters = () => {
  const [{ role, idle }, setFilters] = useQueryStates(ROSTER_FILTER_PARSERS, { history: 'replace' });

  return {
    role,
    idle,
    isFiltered: role !== 'all' || idle !== 'all',
    activeCount: Number(role !== 'all') + Number(idle !== 'all'),
    onRoleChange: (next: RoleFilter) => void setFilters({ role: next }),
    onIdleChange: (next: InactiveFilter) => void setFilters({ idle: next }),
    onReset: () => void setFilters(null)
  };
};
