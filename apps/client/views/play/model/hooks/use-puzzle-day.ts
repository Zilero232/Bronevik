'use client';

import { useState } from 'react';

import { useHydrated } from '@/shared/lib';

import { puzzleDay } from '../../lib/daily-puzzle';

const today = (tick: number) => (tick >= 0 ? puzzleDay(new Date()) : null);

export const usePuzzleDay = () => {
  const isHydrated = useHydrated();
  const [tick, setTick] = useState(0);

  const day = isHydrated ? today(tick) : null;

  return { day, refreshDay: () => setTick((value) => value + 1) };
};
