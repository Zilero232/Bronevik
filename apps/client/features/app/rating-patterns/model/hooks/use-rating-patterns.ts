'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';
import { useHydrated } from '@/shared/lib';

export const useRatingPatterns = () => {
  const isHydrated = useHydrated();
  const { value, set } = useLocalStorage<boolean>(STORAGE_KEYS.ratingPatterns, false);

  return { isEnabled: isHydrated && value === true, setEnabled: set };
};
