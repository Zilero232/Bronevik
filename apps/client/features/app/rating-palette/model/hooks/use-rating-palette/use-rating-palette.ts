'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';
import { useHydrated } from '@/shared/lib';

import type { RatingPalette } from '../../../config';

import { isRatingPalette } from '../../../config';

export const useRatingPalette = () => {
  const isHydrated = useHydrated();
  const { value, set } = useLocalStorage<RatingPalette>(STORAGE_KEYS.ratingPalette, 'default');
  const palette: RatingPalette = isHydrated && isRatingPalette(value) ? value : 'default';

  return { palette, isXvm: palette === 'xvm', setPalette: set };
};
