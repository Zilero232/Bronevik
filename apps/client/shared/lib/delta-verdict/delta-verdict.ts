import type { DeltaVerdict, DeltaVerdictInput } from './delta-verdict.types';

export const deltaVerdict = ({ value, isLowerBetter = false }: DeltaVerdictInput): DeltaVerdict => {
  if (value === 0 || Number.isNaN(value)) {
    return 'same';
  }

  return value > 0 !== isLowerBetter ? 'better' : 'worse';
};
