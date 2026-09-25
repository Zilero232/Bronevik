import type { PlayerMarkRow } from '@/shared/api/players';

export type MarksSort = 'battles' | 'closest' | 'percent';

export type SortMarksInput = {
  rows: PlayerMarkRow[];
  sort: MarksSort;
};
