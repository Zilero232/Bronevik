'use client';

import { useState } from 'react';

import type { MarksSort } from '../../../lib/marks-sort';

import { sortMarks } from '../../../lib/marks-sort';
import { usePlayerMarks, usePlayerTanks } from '../use-profile-queries';

export const useMarksTab = () => {
  const [sort, setSort] = useState<MarksSort>('closest');

  const query = usePlayerMarks();
  const { data: tanks } = usePlayerTanks();

  const averages = new Map(tanks?.items.map(({ vehicle, avgDamage }) => [vehicle.tankId, avgDamage]));

  return {
    query,
    rows: query.data ? sortMarks({ rows: query.data.items, sort }) : [],
    averageDamageOf: (tankId: number) => averages.get(tankId) ?? null,
    sort,
    setSort
  };
};
