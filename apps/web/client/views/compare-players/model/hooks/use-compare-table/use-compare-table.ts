'use client';

import { periodStats } from '@/entities/player/stats';

import type { UseCompareTableInput } from './use-compare-table.types';

import { compareRows } from '../../../lib/compare-rows';
import { useCompareColumns } from '../use-compare-columns';

export const useCompareTable = ({ comparison, period }: UseCompareTableInput) => {
  const players = comparison?.players ?? [];
  const summaries = players.map(({ summary }) => summary);
  const columns = useCompareColumns(summaries);

  return {
    columns,
    players: summaries,
    rows:
      players.length === 0
        ? []
        : compareRows({
            sources: players.map(({ summary, recent }) => ({
              marks: summary.marks,
              stats: periodStats({ overall: summary.overall, recent, period })
            }))
          })
  };
};
