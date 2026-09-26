import type { MasteryThreshold, MoeThreshold } from '../../../../../generated';

import { THRESHOLD_SOURCE_PRIORITY } from '../../config';

const rank = (source: string): number => {
  const index = THRESHOLD_SOURCE_PRIORITY.findIndex((candidate) => candidate === source);

  return index === -1 ? THRESHOLD_SOURCE_PRIORITY.length : index;
};

export const preferredBySource = <T extends MasteryThreshold | MoeThreshold>(rows: readonly T[]): Map<number, T> => {
  const best = new Map<number, T>();

  for (const row of rows) {
    const current = best.get(row.tankId);

    if (!current || rank(row.source) < rank(current.source)) {
      best.set(row.tankId, row);
    }
  }

  return best;
};
