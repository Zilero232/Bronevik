import { sortBy } from 'remeda';
import { match } from 'ts-pattern';

import type { SortMarksInput } from './marks-sort.types';

import { MARKS } from '../../config';

export const sortMarks = ({ rows, sort }: SortMarksInput) => {
  const tracked = rows.filter(({ moePercent }) => moePercent !== null);

  return match(sort)
    .with('percent', () => sortBy(tracked, [({ moePercent }) => moePercent ?? 0, 'desc']))
    .with('battles', () => sortBy(tracked, [({ battles }) => battles, 'desc']))
    .with('closest', () =>
      sortBy(
        tracked,
        [({ moePercent }) => (moePercent ?? 0) >= MARKS.completePercent, 'asc'],
        [({ damageToNextMark }) => damageToNextMark ?? Number.POSITIVE_INFINITY, 'asc']
      )
    )
    .exhaustive();
};
