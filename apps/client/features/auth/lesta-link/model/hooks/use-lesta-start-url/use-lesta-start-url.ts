'use client';

import { lestaStartUrl } from '../../../api';
import { useHydrated } from '@/shared/lib';

export const useLestaStartUrl = (callbackPath: string) => {
  const isHydrated = useHydrated();

  return isHydrated ? lestaStartUrl({ callbackURL: new URL(callbackPath, window.location.origin).toString() }) : undefined;
};
