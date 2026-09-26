'use client';

import { usePlus } from '@/features/plus/plus-gate';

export const useProgressPage = () => {
  const { isPlus, isPending } = usePlus();

  return { isFrozen: !isPending && !isPlus };
};
