import { sortBy, take } from 'remeda';

import type { ClosestMark, ClosestMarksInput } from './closest-marks.types';

export const closestMarks = ({ items, limit = items.length }: ClosestMarksInput): ClosestMark[] =>
  take(
    sortBy(
      items.flatMap(({ vehicle, moePercent, nextMarkPercent, damageToNextMark }) =>
        moePercent === null || nextMarkPercent === null || damageToNextMark === null || nextMarkPercent <= moePercent
          ? []
          : [{ vehicle, percent: moePercent, damageToNext: damageToNextMark }]
      ),
      ({ damageToNext }) => damageToNext
    ),
    Math.max(0, limit)
  );
