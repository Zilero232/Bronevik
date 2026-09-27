'use client';

import { mapValues } from 'remeda';

import type { UseRosterInput } from './use-roster.types';

import { activityDistribution } from '../../../lib/activity-status';
import { filterRoster, toRosterRows } from '../../../lib/roster';
import { useRosterFilters } from '../use-roster-filters';

export const useRoster = ({ members, now }: UseRosterInput) => {
  const { role, idle } = useRosterFilters();

  const all = toRosterRows({ members, now });
  const distribution = activityDistribution(members.map(({ inactiveDays }) => inactiveDays));

  return {
    rows: filterRoster({ rows: all, role, inactive: idle }),
    total: all.length,
    distribution,
    shares: mapValues(distribution, (count) => (all.length > 0 ? count / all.length : 0))
  };
};
