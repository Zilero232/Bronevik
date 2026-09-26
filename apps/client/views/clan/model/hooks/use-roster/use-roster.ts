'use client';

import { parseAsStringLiteral, useQueryStates } from 'nuqs';
import { mapValues } from 'remeda';

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
  const distribution = activityDistribution(members.map(({ inactiveDays }) => inactiveDays));

  return {
    role,
    idle,
    rows: filterRoster({ rows: all, role, inactive: idle }),
    total: all.length,
    distribution,
    shares: mapValues(distribution, (count) => (all.length > 0 ? count / all.length : 0)),
    isFiltered: role !== 'all' || idle !== 'all',
    setFilters,
    reset: () => setFilters(null)
  };
};
