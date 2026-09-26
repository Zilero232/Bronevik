'use client';

import { startOfDay } from 'date-fns';

import { useClientNow } from '@/shared/lib';

export const useToday = () => {
  const now = useClientNow();

  return now ? startOfDay(now) : null;
};
