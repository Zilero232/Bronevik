import type { MarksSort } from '../lib/marks-sort';

export const MARKS = {
  targetPercent: 95,
  skeletonHeight: 480,
  sorts: ['closest', 'percent', 'battles'] satisfies readonly MarksSort[]
} as const;
