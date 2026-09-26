import type { PlayerMarkRow } from '@/entities/player/profile';

export type MarksSort = 'battles' | 'closest' | 'percent';

export type SortMarksInput = {
  rows: PlayerMarkRow[];
  sort: MarksSort;
};
