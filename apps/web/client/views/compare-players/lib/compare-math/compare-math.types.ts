import type { CompareDirection } from '../../model/compare.types';

export type BestIndicesInput = {
  values: (number | null)[];
  direction: CompareDirection;
};

export type DeltasToBestInput = {
  values: (number | null)[];
  best: number[];
};
