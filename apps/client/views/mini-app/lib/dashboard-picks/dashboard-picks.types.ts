import type { LinkedAccounts, PlayerMarkRow, PlayerMarks } from '@bronevik/schemas';

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

export type MarksDigest = {
  summary: PlayerMarks['summary'];
  chases: MarkChase[];
};
