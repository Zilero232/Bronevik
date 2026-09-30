'use client';

import { vehicleIdentity } from '@/entities/tank/tank';

import { summarizeStats } from '../../../lib/stats-summary';
import { useTankStats } from '../use-tank-stats';

export const useTanksFigures = () => {
  const { data, isPending, isError } = useTankStats();
  const summary = summarizeStats(data?.items ?? []);

  return {
    total: data?.total ?? null,
    summary,
    heroTanks: summary.leaders.map((row) => vehicleIdentity(row.vehicle)),
    isPending,
    hasFigures: isPending || isError || summary.battles > 0
  };
};
