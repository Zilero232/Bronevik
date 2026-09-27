import { range, reverse } from 'remeda';

import type { WrappedChapter, WrappedStoryData, WrappedYearsInput } from './wrapped-story.types';

import { WRAPPED_CHAPTERS, WRAPPED_YEARS } from '../../config';

export const parseWrappedYear = (raw: string): number | null => {
  if (!/^\d{4}$/u.test(raw)) {
    return null;
  }

  const year = Number(raw);

  return year >= WRAPPED_YEARS.min && year <= WRAPPED_YEARS.max ? year : null;
};

export const wrappedYears = ({ now, year }: WrappedYearsInput): number[] => {
  const last = Math.max(now?.getUTCFullYear() ?? year, year);

  return reverse(range(WRAPPED_YEARS.min, last + 1));
};

export const wrappedChapters = (wrapped: WrappedStoryData): WrappedChapter[] => {
  const present: Record<WrappedChapter, boolean> = {
    activity: wrapped.battles > 0,
    damage: wrapped.damageDealt > 0,
    tanks: wrapped.topTanks.length > 0,
    marks: wrapped.marksGained + wrapped.masteriesGained + wrapped.badges.length > 0,
    best: wrapped.bestBattle !== null
  };

  return WRAPPED_CHAPTERS.filter((chapter) => present[chapter]);
};
