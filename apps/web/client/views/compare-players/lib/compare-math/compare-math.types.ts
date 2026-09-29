import type { CompareDirection } from '../compare-rows';

export type BestIndicesInput = {
  values: (number | null)[];
  direction: CompareDirection;
};

export type DeltasToBestInput = {
  values: (number | null)[];
  best: number[];
};
