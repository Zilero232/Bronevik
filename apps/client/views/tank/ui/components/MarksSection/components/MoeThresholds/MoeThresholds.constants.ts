import type { MoePlateConfig } from './MoeThresholds.types';

export const MOE_PLATES: readonly MoePlateConfig[] = [
  { key: 'p65', percent: 65, marks: 1, isFeatured: false },
  { key: 'p85', percent: 85, marks: 2, isFeatured: false },
  { key: 'p95', percent: 95, marks: 3, isFeatured: true },
  { key: 'p100', percent: 100, marks: 3, isFeatured: false }
];
