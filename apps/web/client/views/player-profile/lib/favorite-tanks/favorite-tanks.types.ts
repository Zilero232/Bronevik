import type { PlayerTankRow } from '@otmetki/schemas';

export type FavoriteTanksInput = {
  rows: readonly PlayerTankRow[];
  count: number;
};
