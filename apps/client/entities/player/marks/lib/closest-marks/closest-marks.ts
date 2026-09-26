import { sortBy, take } from 'remeda';

import type { ClosestMark, ClosestMarksInput } from './closest-marks.types';

import { markCountAt, markProgress } from '../mark-progress';

export const closestMarks = ({ items, limit = items.length }: ClosestMarksInput): ClosestMark[] =>
  take(
    sortBy(
      items.flatMap(({ vehicle, marksOnGun, moePercent, nextMarkPercent, damageToNextMark }) =>
        moePercent === null || nextMarkPercent === null || damageToNextMark === null || nextMarkPercent <= moePercent
          ? []
          : [
              {
                vehicle,
                marks: marksOnGun ?? 0,
                percent: moePercent,
                nextMark: nextMarkPercent,
                nextMarks: markCountAt(nextMarkPercent),
                gap: nextMarkPercent - moePercent,
                damageToNext: damageToNextMark,
                progress: markProgress({ percent: moePercent, nextMark: nextMarkPercent })
              }
            ]
      ),
      ({ damageToNext }) => damageToNext
    ),
    Math.max(0, limit)
  );
