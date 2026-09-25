import type { PlayerTankRow } from '@bronevik/schemas';

export type HighlightListProps = {
  kind: 'best' | 'worst';
  rows: PlayerTankRow[];
};
