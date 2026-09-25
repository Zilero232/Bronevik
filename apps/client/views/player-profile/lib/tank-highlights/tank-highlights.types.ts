import type { PlayerTankRow } from '@bronevik/schemas';

export type TankHighlightsInput = {
  rows: PlayerTankRow[];
  count: number;
  minBattles: number;
};

export type TankHighlights = {
  best: PlayerTankRow[];
  worst: PlayerTankRow[];
};
