'use client';

import { useEffect } from 'react';

import { useRatingPatterns } from '../use-rating-patterns';

export const useRatingPatternsSync = () => {
  const { isEnabled } = useRatingPatterns();

  useEffect(() => {
    document.documentElement.dataset.ratingPatterns = isEnabled ? 'on' : 'off';
  }, [isEnabled]);
};
