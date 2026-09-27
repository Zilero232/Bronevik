import type { SkillCohort } from '../../../../../../generated';
import type { AssignCohortInput, ByThresholdsInput } from './cohort.types';

import { COHORT } from './cohort.constants';

const byThresholds = ({ value, thresholds }: ByThresholdsInput): SkillCohort => {
  if (value >= thresholds.elite) {
    return 'elite';
  }

  if (value >= thresholds.good) {
    return 'good';
  }

  return value >= thresholds.average ? 'average' : 'beginner';
};

export const assignCohort = ({ battles, winRate, wn8 }: AssignCohortInput): SkillCohort => {
  if (battles < COHORT.minBattles) {
    return 'beginner';
  }

  if (wn8 !== undefined && wn8 !== null) {
    return byThresholds({ value: wn8, thresholds: COHORT.wn8 });
  }

  return byThresholds({ value: winRate, thresholds: COHORT.winRate });
};
