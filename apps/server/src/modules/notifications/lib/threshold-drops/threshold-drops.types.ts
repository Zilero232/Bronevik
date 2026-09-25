type ThresholdValues = {
  p65: number;
  p85: number;
  p95: number;
};

export type ThresholdDropsInput = {
  previous: ThresholdValues;
  current: ThresholdValues;
  minDropPercent: number;
};

export type ThresholdDrop = {
  mark: 1 | 2 | 3;
  from: number;
  to: number;
};
