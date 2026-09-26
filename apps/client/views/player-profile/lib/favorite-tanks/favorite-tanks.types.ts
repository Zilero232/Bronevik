import type { PlayerTankRow } from '@bronevik/schemas';

export type FavoriteTanksInput = {
  rows: readonly PlayerTankRow[];
  count: number;
};
