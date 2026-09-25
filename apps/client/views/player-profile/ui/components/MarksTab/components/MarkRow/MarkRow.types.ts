import type { PlayerMarkRow } from '@/shared/api/players';

export type MarkRowProps = {
  row: PlayerMarkRow;
  averageDamage: number | null;
  index: number;
};
