'use client';

import { summarizeStats } from '../../../lib/stats-summary';
import { useTankStats } from '../use-tank-stats';

export const useTanksFigures = () => {
  const { data, isPending } = useTankStats();

  return { total: data?.total ?? null, summary: summarizeStats(data?.items ?? []), isPending };
};
