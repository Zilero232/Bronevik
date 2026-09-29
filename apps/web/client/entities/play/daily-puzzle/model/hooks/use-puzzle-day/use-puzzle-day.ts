'use client';

import { useState } from 'react';

import { useClientNow } from '@/shared/lib';

import { puzzleDay } from '../../../lib/puzzle-day';

export const usePuzzleDay = () => {
  const mountedAt = useClientNow();
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const now = refreshedAt ?? mountedAt;

  return { day: now ? puzzleDay(now) : null, refreshDay: () => setRefreshedAt(new Date()) };
};
