export type DeltaVerdictInput = {
  value: number | null;
  isLowerBetter?: boolean;
};

export type DeltaVerdict = 'better' | 'same' | 'worse';
