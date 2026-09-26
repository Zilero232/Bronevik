'use client';

import { useState } from 'react';

import type { MarksSort } from '../../../lib/marks-sort';

import { sortMarks } from '../../../lib/marks-sort';
import { usePlayerMarks, usePlayerTanks } from '../use-profile-queries';

export const useMarksTab = () => {
  const [sort, setSort] = useState<MarksSort>('closest');

  const { data: marks, isPending, isError, isRefetching, refetch } = usePlayerMarks();
  const { data: tanks } = usePlayerTanks();

  const averages = new Map(tanks?.items.map(({ vehicle, avgDamage }) => [vehicle.tankId, avgDamage]));

  return {
    marks,
    rows: marks ? sortMarks({ rows: marks.items, sort }) : [],
    averageDamageOf: (tankId: number) => averages.get(tankId) ?? null,
    sort,
    setSort,
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
