import type { PlayerMarkRow } from '@otmetki/schemas';

export type ClosestMarksInput = {
  items: readonly PlayerMarkRow[];
  limit?: number;
};

export type ClosestMark = Pick<PlayerMarkRow, 'vehicle'> & {
  percent: number;
  damageToNext: number;
};
