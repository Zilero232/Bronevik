import { isDefined, pickBy } from 'remeda';

import type { RequirementEntry, RequirementsFormOutput, StatRequirements } from './requirements.types';

import { REQUIREMENT_KEYS, REQUIREMENTS_FORM } from '../../config';

const numberOrUndefined = (value: string): number | undefined => (value.trim() === '' ? undefined : Number(value));

export const requirementEntries = (requirements: StatRequirements): RequirementEntry[] =>
  REQUIREMENT_KEYS.flatMap((key) => {
    const value = requirements[key];

    if (value === undefined) {
      return [];
    }

    return [{ key, value: key === 'minWinRate' ? value * REQUIREMENTS_FORM.percentScale : value }];
  });

export const toStatRequirements = ({ minBattles, minWn8, maxWn8, minWinRate }: RequirementsFormOutput): StatRequirements => {
  const winRate = numberOrUndefined(minWinRate);

  return pickBy(
    {
      minBattles: numberOrUndefined(minBattles),
      minWn8: numberOrUndefined(minWn8),
      maxWn8: numberOrUndefined(maxWn8),
      minWinRate: winRate === undefined ? undefined : winRate / REQUIREMENTS_FORM.percentScale
    },
    isDefined
  );
};
