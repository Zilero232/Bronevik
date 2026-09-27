import type { MarkCount, MasteryLevel } from '@otmetki/icons';

const MASTERY_LEVELS: Readonly<Partial<Record<number, MasteryLevel>>> = { 1: 'third', 2: 'second', 3: 'first', 4: 'master' };

const MARK_COUNTS: readonly MarkCount[] = [1, 2, 3];

export const TANK_AWARDS = {
  mastery: MASTERY_LEVELS,
  marks: MARK_COUNTS,
  markSize: 20,
  masterySize: 18,
  strokeWidth: 1.6
} as const;
