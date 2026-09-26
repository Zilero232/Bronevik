import type { MissionProgressItem } from '@otmetki/schemas';

export type OperationProgressInput = {
  questIds: readonly number[];
  items: readonly MissionProgressItem[];
};

export type OperationProgress = {
  total: number;
  done: number;
  honors: number;
};
