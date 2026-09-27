import type { RatingTone } from '@/shared/lib';

import type { CompareFormat, CompareMetricKey, CompareMetricSource } from '../../model/compare.types';

export type CompareRowsInput = {
  sources: CompareMetricSource[];
};

export type CompareRow = {
  key: CompareMetricKey;
  format: CompareFormat;
  values: (number | null)[];
  best: number[];
  deltas: (number | null)[];
  tones: (RatingTone | null)[];
  isLowerBetter: boolean;
};

export type DisplayValueInput = {
  value: number;
  format: CompareFormat;
};
