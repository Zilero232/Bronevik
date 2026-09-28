'use client';

import { isbot } from 'isbot';

import { useHydrated } from '../use-hydrated';

export const useIsCrawler = (): boolean | null => {
  const isHydrated = useHydrated();

  return isHydrated ? isbot(navigator.userAgent) : null;
};
