import type { BronyaComponent } from '@bronevik/ratings';

export type BronyaReferencePayload = {
  kind: 'bronya';
  players: number;
  levels: number[];
  components: Record<BronyaComponent, number[]>;
};

export type ParseBronyaReferenceInput = {
  tankId: number;
  value: unknown;
};
