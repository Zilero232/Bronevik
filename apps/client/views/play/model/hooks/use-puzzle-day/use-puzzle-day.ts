'use client';

import { useState } from 'react';

import { useHydrated } from '@/shared/lib';

import { puzzleDay } from '../../../lib/daily-puzzle';

export const usePuzzleDay = () => {
  const isHydrated = useHydrated();
  const [now, setNow] = useState(() => new Date());

  return { day: isHydrated ? puzzleDay(now) : null, refreshDay: () => setNow(new Date()) };
};
