import type { MARK_LEVELS } from '../../config';

export type MarkLevel = (typeof MARK_LEVELS)[number];

export type MarkProgressInput = {
  percent: number;
  nextMark: number;
};

export type MarkRing = {
  marks: MarkLevel;
  nextMark: number | null;
  ratio: number;
};
