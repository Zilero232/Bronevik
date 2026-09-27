export type DeltaVerdict = 'better' | 'same' | 'worse';

export type DeltaViewInput = {
  value: number;
  verdict?: DeltaVerdict;
  isLowerBetter: boolean;
  options: Intl.NumberFormatOptions;
};

export type DeltaView = {
  isKnown: boolean;
  verdict: DeltaVerdict;
  shown: number;
};

export type DeltaVerdictInput = {
  value: number;
  isLowerBetter?: boolean;
  digits?: number;
};
