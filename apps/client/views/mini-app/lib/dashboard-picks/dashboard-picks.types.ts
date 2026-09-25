import type { LinkedAccounts, PlayerMarkRow } from '@bronevik/schemas';

export type LestaAccount = LinkedAccounts['lesta'][number];

export type ClosestMarksInput = {
  items: PlayerMarkRow[];
  limit: number;
};

export type MarkChase = {
  row: PlayerMarkRow;
  percent: number;
  target: number;
  gap: number;
};
