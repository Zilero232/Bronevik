import type { MarkCount } from '@otmetki/icons';
import type { PlayerMarkRow, VehicleSummary } from '@otmetki/schemas';

export type ClosestMarksInput = {
  items: readonly PlayerMarkRow[];
  limit?: number;
};

export type ClosestMark = {
  vehicle: VehicleSummary;
  marks: number;
  percent: number;
  nextMark: number;
  nextMarks: MarkCount;
  gap: number;
  damageToNext: number;
  progress: number;
};
