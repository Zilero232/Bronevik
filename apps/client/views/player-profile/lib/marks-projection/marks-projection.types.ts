import type { PlayerMarkRow } from '@/shared/api/players';

export type MarksProjectionInput = {
  row: PlayerMarkRow;
  averageDamage: number | null;
  targetPercent: number;
};

export type MarksProjection = { kind: 'done' } | { kind: 'projected'; battles: number } | { kind: 'unknown' } | { kind: 'unreachable' };
