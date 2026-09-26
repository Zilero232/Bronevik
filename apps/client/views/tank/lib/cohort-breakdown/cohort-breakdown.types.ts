import type { SkillCohort, TankServerStatsRow } from '@otmetki/schemas';

export type CohortBar = {
  cohort: Exclude<SkillCohort, 'all'>;
  winRate: number;
  avgDamage: number;
  battles: number;
  winRateShare: number;
  damageShare: number;
};

export type CohortRowInput = {
  rows: readonly TankServerStatsRow[];
  cohort: SkillCohort;
};

export type ShareInput = {
  value: number;
  max: number;
};
