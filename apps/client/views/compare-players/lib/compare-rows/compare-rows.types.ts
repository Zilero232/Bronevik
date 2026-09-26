import type { CompareFormat, CompareMetricKey, CompareMetricSource } from '../../config';

export type CompareRowsInput = {
  sources: CompareMetricSource[];
};

export type CompareRow = {
  key: CompareMetricKey;
  format: CompareFormat;
  values: (number | null)[];
  best: number[];
};

export type DisplayValueInput = {
  value: number;
  format: CompareFormat;
};
