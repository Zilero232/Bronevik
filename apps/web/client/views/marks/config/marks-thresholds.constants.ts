import type { MarkCount, MasteryLevel } from '@otmetki/icons';

export const MOE_THRESHOLD_KEYS = ['p65', 'p85', 'p95', 'p100'] as const;

export const DRAWER_THRESHOLDS = [
  { key: 'p65', marks: 1 },
  { key: 'p85', marks: 2 },
  { key: 'p95', marks: 3 },
  { key: 'p100', marks: null }
] as const satisfies readonly { key: (typeof MOE_THRESHOLD_KEYS)[number]; marks: MarkCount | null }[];

export const MASTERY_LEVELS = [
  { level: 'third', key: 'class3' },
  { level: 'second', key: 'class2' },
  { level: 'first', key: 'class1' },
  { level: 'master', key: 'master' }
] as const satisfies readonly { level: MasteryLevel; key: 'class1' | 'class2' | 'class3' | 'master' }[];

export const NUMERIC_COLUMN = { align: 'end', isNumeric: true } as const;

export const CURVE_THRESHOLDS = [
  { key: 'p65', percent: 65 },
  { key: 'p85', percent: 85 },
  { key: 'p95', percent: 95 },
  { key: 'p100', percent: 100 }
] as const satisfies readonly { key: (typeof MOE_THRESHOLD_KEYS)[number]; percent: number }[];
