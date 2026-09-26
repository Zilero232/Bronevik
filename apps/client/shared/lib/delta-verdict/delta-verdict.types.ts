export type DeltaVerdict = 'better' | 'same' | 'worse';

export type DeltaVerdictInput = {
  value: number;
  isLowerBetter?: boolean;
};
