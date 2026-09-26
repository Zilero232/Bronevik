'use client';

import { startOfDay } from 'date-fns';
import { useState } from 'react';

import { useHydrated } from '@/shared/lib';

export const useToday = () => {
  const isHydrated = useHydrated();
  const [today] = useState(() => startOfDay(new Date()));

  return isHydrated ? today : null;
};
