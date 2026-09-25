'use client';

import { parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { UseRosterInput } from './use-roster.types';

import { INACTIVE_FILTERS, ROLE_FILTERS } from '../../../config';
import { activityDistribution } from '../../../lib/activity-status';
import { filterRoster, toRosterRows } from '../../../lib/roster';

const ROSTER_PARSERS = {
  role: parseAsStringLiteral(ROLE_FILTERS).withDefault('all'),
  idle: parseAsStringLiteral(INACTIVE_FILTERS).withDefault('all')
};

export const useRoster = ({ members, now }: UseRosterInput) => {
  const [{ role, idle }, setFilters] = useQueryStates(ROSTER_PARSERS, { history: 'replace' });

  const all = toRosterRows({ members, now });

  return {
    role,
    idle,
    rows: filterRoster({ rows: all, role, inactive: idle }),
    total: all.length,
    distribution: activityDistribution(members.map(({ inactiveDays }) => inactiveDays)),
    isFiltered: role !== 'all' || idle !== 'all',
    setFilters,
    reset: () => setFilters(null)
  };
};
