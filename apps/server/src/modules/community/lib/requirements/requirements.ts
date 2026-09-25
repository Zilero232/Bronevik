import type { CheckRequirementsInput, RequirementFailure, StatRequirements } from './requirements.types';

import { statRequirementsSchema } from './requirements.schemas';

export const readRequirements = (value: unknown): StatRequirements => {
  const parsed = statRequirementsSchema.safeParse(value);

  return parsed.success ? parsed.data : {};
};

export const unmetRequirements = ({ stats, requirements }: CheckRequirementsInput): RequirementFailure[] => {
  const needsStats = Object.values(requirements).some((value) => value !== undefined);

  if (!stats) {
    return needsStats ? ['noStats'] : [];
  }

  const failures: RequirementFailure[] = [];

  if (requirements.minBattles !== undefined && stats.battles < requirements.minBattles) {
    failures.push('minBattles');
  }

  if (requirements.minWinRate !== undefined && (stats.winRate === null || stats.winRate < requirements.minWinRate)) {
    failures.push('minWinRate');
  }

  if (requirements.minWn8 !== undefined && (stats.wn8 === null || stats.wn8 < requirements.minWn8)) {
    failures.push('minWn8');
  }

  if (requirements.maxWn8 !== undefined && (stats.wn8 === null || stats.wn8 > requirements.maxWn8)) {
    failures.push('maxWn8');
  }

  return failures;
};
