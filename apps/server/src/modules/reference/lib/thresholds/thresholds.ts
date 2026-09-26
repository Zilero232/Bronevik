import type { MasteryThreshold as MasteryThresholdDto, MoeThreshold as MoeThresholdDto } from '@otmetki/schemas';

import type { MasteryThreshold, MoeThreshold } from '../../../../../generated';

import { isoDay } from '../../../../common/lib';
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

export const toMoeThreshold = (row: MoeThreshold): MoeThresholdDto => ({
  tankId: row.tankId,
  date: isoDay(row.date),
  source: row.source,
  p65: row.p65,
  p85: row.p85,
  p95: row.p95,
  p100: row.p100
});

export const toMasteryThreshold = (row: MasteryThreshold): MasteryThresholdDto => ({
  tankId: row.tankId,
  date: isoDay(row.date),
  source: row.source,
  class3: row.class3,
  class2: row.class2,
  class1: row.class1,
  master: row.master
});
