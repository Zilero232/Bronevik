'use client';

import { lestaStartUrl } from '@/shared/api/auth';
import { useHydrated } from '@/shared/lib';

export const useLestaStartUrl = (callbackPath: string) => {
  const isHydrated = useHydrated();

  return isHydrated ? lestaStartUrl({ callbackURL: new URL(callbackPath, window.location.origin).toString() }) : undefined;
};
