import type { MarkCount } from '@otmetki/icons';

import { MOE, moeMarks } from '@otmetki/ratings';
import { clamp } from 'remeda';

import type { MarkProgressInput } from './mark-progress.types';

import { MARK_COUNTS } from '../../config';

export const markProgress = ({ percent, nextMark }: MarkProgressInput): number => {
  const previous = [0, ...MOE.markPercents].filter((mark) => mark < nextMark).at(-1) ?? 0;

  return clamp((percent - previous) / (nextMark - previous), { min: 0, max: 1 });
};

export const markCountAt = (percent: number): MarkCount => MARK_COUNTS[clamp(moeMarks(percent), { min: 1, max: MARK_COUNTS.length }) - 1] ?? 3;
