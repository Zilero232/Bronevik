import type { MarkCount } from '@otmetki/icons';

import { MOE, moeMarks } from '@otmetki/ratings';
import { clamp } from 'remeda';

import type { MarkLevel, MarkRing } from './mark-progress.types';

import { MARK_COUNTS, MARK_LEVELS } from '../../config';

export const markRing = (percent: number): MarkRing => ({
  marks: MARK_LEVELS[clamp(moeMarks(percent), { min: 0, max: MARK_COUNTS.length })] ?? 0,
  nextMark: MOE.markPercents.find((mark) => mark > percent) ?? null
});

export const markTarget = (marks: MarkLevel): MarkCount => MARK_COUNTS[Math.min(marks, MARK_COUNTS.length - 1)] ?? 3;
