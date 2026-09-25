import type { MarkCount } from '@bronevik/icons';
import type { VehicleSummary } from '@bronevik/schemas';

export type MarkProgressInput = {
  percent: number;
  nextMark: number;
};

export type ClosestMark = {
  vehicle: VehicleSummary;
  marks: number;
  percent: number;
  nextMark: number;
  nextMarks: MarkCount;
  damageToNext: number;
  progress: number;
};
