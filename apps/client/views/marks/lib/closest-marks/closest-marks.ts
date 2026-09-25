import type { MarkCount } from '@bronevik/icons';
import type { PlayerMarkRow } from '@bronevik/schemas';

import { MOE, moeMarks } from '@bronevik/ratings';
import { clamp, sortBy } from 'remeda';

import type { ClosestMark, MarkProgressInput } from './closest-marks.types';

export const markProgress = ({ percent, nextMark }: MarkProgressInput): number => {
  const previous = [0, ...MOE.markPercents].filter((mark) => mark < nextMark).at(-1) ?? 0;

  return clamp((percent - previous) / (nextMark - previous), { min: 0, max: 1 });
};

const MARK_COUNTS = [1, 2, 3] as const;

export const markCountAt = (percent: number): MarkCount => MARK_COUNTS[clamp(moeMarks(percent), { min: 1, max: MARK_COUNTS.length }) - 1] ?? 3;

export const closestMarks = (items: PlayerMarkRow[]): ClosestMark[] =>
  sortBy(
    items.flatMap(({ vehicle, marksOnGun, moePercent, nextMarkPercent, damageToNextMark }) =>
      moePercent === null || nextMarkPercent === null || damageToNextMark === null
        ? []
        : [
            {
              vehicle,
              marks: marksOnGun ?? 0,
              percent: moePercent,
              nextMark: nextMarkPercent,
              nextMarks: markCountAt(nextMarkPercent),
              damageToNext: damageToNextMark,
              progress: markProgress({ percent: moePercent, nextMark: nextMarkPercent })
            }
          ]
    ),
    ({ damageToNext }) => damageToNext
  );
