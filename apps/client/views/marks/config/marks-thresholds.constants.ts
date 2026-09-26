import type { MarkCount, MasteryLevel } from '@bronevik/icons';

export const MOE_THRESHOLD_KEYS = ['p65', 'p85', 'p95', 'p100'] as const;

export const DRAWER_THRESHOLDS: readonly { key: (typeof MOE_THRESHOLD_KEYS)[number]; marks: MarkCount | null }[] = [
  { key: 'p65', marks: 1 },
  { key: 'p85', marks: 2 },
  { key: 'p95', marks: 3 },
  { key: 'p100', marks: null }
];

export const MASTERY_LEVELS: readonly { level: MasteryLevel; key: 'class1' | 'class2' | 'class3' | 'master' }[] = [
  { level: 'third', key: 'class3' },
  { level: 'second', key: 'class2' },
  { level: 'first', key: 'class1' },
  { level: 'master', key: 'master' }
];

export const NUMERIC_COLUMN = { align: 'end', isNumeric: true } as const;
