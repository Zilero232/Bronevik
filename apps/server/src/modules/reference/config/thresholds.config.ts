import type { ThresholdKind, ThresholdSource } from '../../../../generated';
import type { ThresholdLevel } from '../reference.types';

export const THRESHOLD_SOURCE_PRIORITY = ['manual', 'otmetki', 'poliroid', 'kttc', 'lesta'] as const satisfies readonly ThresholdSource[];

export const THRESHOLD_LEVELS = {
  moe: { p65: 'level1', p85: 'level2', p95: 'level3', p100: 'level4' },
  mastery: { class3: 'level1', class2: 'level2', class1: 'level3', master: 'level4' }
} as const satisfies Record<ThresholdKind, Record<string, ThresholdLevel>>;
