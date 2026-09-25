import type { MarkCount, MasteryLevel } from '@bronevik/icons';

type DrawerThreshold = {
  key: 'p100' | 'p65' | 'p85' | 'p95';
  marks: MarkCount | null;
};

export const DRAWER_THRESHOLDS: readonly DrawerThreshold[] = [
  { key: 'p65', marks: 1 },
  { key: 'p85', marks: 2 },
  { key: 'p95', marks: 3 },
  { key: 'p100', marks: null }
];

type DrawerMastery = {
  level: MasteryLevel;
  key: 'class1' | 'class2' | 'class3' | 'master';
};

export const MASTERY_LEVELS: readonly DrawerMastery[] = [
  { level: 'third', key: 'class3' },
  { level: 'second', key: 'class2' },
  { level: 'first', key: 'class1' },
  { level: 'master', key: 'master' }
];
