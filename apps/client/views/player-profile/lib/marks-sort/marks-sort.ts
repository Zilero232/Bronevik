import { sortBy } from 'remeda';

import type { SortMarksInput } from './marks-sort.types';

const COMPLETE = 100;

export const sortMarks = ({ rows, sort }: SortMarksInput) => {
  const tracked = rows.filter(({ moePercent }) => moePercent !== null);

  if (sort === 'percent') {
    return sortBy(tracked, [({ moePercent }) => moePercent ?? 0, 'desc']);
  }

  if (sort === 'battles') {
    return sortBy(tracked, [({ battles }) => battles, 'desc']);
  }

  return sortBy(
    tracked,
    [({ moePercent }) => (moePercent ?? 0) >= COMPLETE, 'asc'],
    [({ damageToNextMark }) => damageToNextMark ?? Number.POSITIVE_INFINITY, 'asc']
  );
};
