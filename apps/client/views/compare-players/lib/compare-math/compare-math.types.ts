import type { CompareDirection } from '../../config';

export type BestIndicesInput = {
  values: (number | null)[];
  direction: CompareDirection;
};
