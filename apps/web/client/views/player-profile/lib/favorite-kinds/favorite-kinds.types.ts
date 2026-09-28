import type { PlayerTankRow } from '@otmetki/schemas';

export type FavoriteShare<T> = {
  value: T;
  share: number;
};

export type FavoriteKinds = {
  nation: FavoriteShare<PlayerTankRow['vehicle']['nation']> | null;
  tankClass: FavoriteShare<PlayerTankRow['vehicle']['type']> | null;
};
