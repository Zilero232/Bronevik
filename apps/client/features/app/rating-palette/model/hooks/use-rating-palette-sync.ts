'use client';

import { useEffect } from 'react';

import { useRatingPalette } from './use-rating-palette';

export const useRatingPaletteSync = () => {
  const { palette } = useRatingPalette();

  useEffect(() => {
    document.documentElement.dataset.ratingPalette = palette;
  }, [palette]);
};
