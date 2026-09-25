import type { SkillCohort, TankServerStatsRow } from '@bronevik/schemas';

import type { CohortBar } from './cohort-breakdown.types';

import { BREAKDOWN_COHORTS } from '../../config';

const share = (value: number, max: number) => (max > 0 ? value / max : 0);

export const cohortRow = (rows: readonly TankServerStatsRow[], cohort: SkillCohort) => rows.find((row) => row.cohort === cohort);

export const cohortBreakdown = (rows: readonly TankServerStatsRow[]): CohortBar[] => {
  const present = BREAKDOWN_COHORTS.flatMap((cohort) => {
    const row = cohortRow(rows, cohort);

    return row ? [{ cohort, row }] : [];
  });

  const maxWinRate = Math.max(0, ...present.map(({ row }) => row.winRate));
  const maxDamage = Math.max(0, ...present.map(({ row }) => row.avgDamage));

  return present.map(({ cohort, row }) => ({
    cohort,
    winRate: row.winRate,
    avgDamage: row.avgDamage,
    battles: row.battles,
    winRateShare: share(row.winRate, maxWinRate),
    damageShare: share(row.avgDamage, maxDamage)
  }));
};
