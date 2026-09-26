'use client';

import { useHydrated } from '@/shared/lib';

import { lestaStartUrl } from '../../../api';

export const useLestaStartUrl = (callbackPath: string) => {
  const isHydrated = useHydrated();

  return isHydrated ? lestaStartUrl({ callbackURL: new URL(callbackPath, window.location.origin).toString() }) : undefined;
};
