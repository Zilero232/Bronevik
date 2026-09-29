import type { MoeCurve } from '@otmetki/schemas';

export type CurveEntry = {
  percent: number;
  damage: number;
  source: 'mod' | 'threshold';
  players: number | null;
  battles: number | null;
};

export type CurveEntriesInput = Pick<MoeCurve, 'points' | 'thresholds'>;
