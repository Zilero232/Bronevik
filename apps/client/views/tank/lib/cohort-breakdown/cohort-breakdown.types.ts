import type { SkillCohort } from '@bronevik/schemas';

export type CohortBar = {
  cohort: Exclude<SkillCohort, 'all'>;
  winRate: number;
  avgDamage: number;
  battles: number;
  winRateShare: number;
  damageShare: number;
};
