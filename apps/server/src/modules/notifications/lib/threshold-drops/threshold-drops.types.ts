import type { MoeThresholdValues } from '@otmetki/schemas';

type ThresholdValues = Omit<MoeThresholdValues, 'p100'>;

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
