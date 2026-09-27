import type { MoeHistoryBatch } from '@otmetki/schemas';

import { groupBy, sortBy } from 'remeda';

import type { HistorySeriesInput, HistorySourceRow } from './moe-history.types';

import { THRESHOLD_SOURCE_PRIORITY } from '../../../reference';

const sourceRank = (source: string): number => {
  const index = THRESHOLD_SOURCE_PRIORITY.findIndex((candidate) => candidate === source);

  return index === -1 ? THRESHOLD_SOURCE_PRIORITY.length : index;
};

const preferred = (rows: readonly HistorySourceRow[]): HistorySourceRow[] => {
  const best = new Map<string, HistorySourceRow>();

  for (const row of rows) {
    const current = best.get(row.date);

    if (!current || sourceRank(row.source) < sourceRank(current.source)) {
      best.set(row.date, row);
    }
  }

  return sortBy([...best.values()], (row) => row.date);
};

export const historySeries = ({ rows, tankIds }: HistorySeriesInput): MoeHistoryBatch['series'] => {
  const byTank = groupBy(rows, (row) => row.tankId);

  return tankIds.map((tankId) => ({
    tankId,
    points: preferred(byTank[tankId] ?? []).map(({ date, p65, p85, p95, p100 }) => ({ date, p65, p85, p95, p100 }))
  }));
};
