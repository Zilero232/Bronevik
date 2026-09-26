import type { MarkCount } from '@otmetki/icons';

import { MOE, moeMarks } from '@otmetki/ratings';
import { clamp } from 'remeda';

import type { MarkProgressInput, MarkRing } from './mark-progress.types';

import { MARK_COUNTS, MARK_LEVELS } from '../../config';

export const markProgress = ({ percent, nextMark }: MarkProgressInput): number => {
  const previous = [0, ...MOE.markPercents].filter((mark) => mark < nextMark).at(-1) ?? 0;

  return clamp((percent - previous) / (nextMark - previous), { min: 0, max: 1 });
};

export const markCountAt = (percent: number): MarkCount => MARK_COUNTS[clamp(moeMarks(percent), { min: 1, max: MARK_COUNTS.length }) - 1] ?? 3;

export const markRing = (percent: number): MarkRing => {
  const marks = MARK_LEVELS[clamp(moeMarks(percent), { min: 0, max: MARK_COUNTS.length })] ?? 0;
  const nextMark = MOE.markPercents.find((mark) => mark > percent) ?? null;

  return { marks, nextMark, ratio: nextMark === null ? 1 : markProgress({ percent, nextMark }) };
};
