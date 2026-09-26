import type { DeltaVerdict, DeltaVerdictInput } from './delta-verdict.types';

export const deltaVerdict = ({ value, isLowerBetter = false }: DeltaVerdictInput): DeltaVerdict => {
  if (value === null || value === 0) {
    return 'same';
  }

  return value > 0 !== isLowerBetter ? 'better' : 'worse';
};
