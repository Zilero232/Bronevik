import type { PlayerTankRow } from '@otmetki/schemas';

export type FavoriteShare<T> = {
  value: T;
  share: number;
};

export type TopShareInput<T> = {
  rows: readonly PlayerTankRow[];
  key: (row: PlayerTankRow) => T;
};

export type FavoriteKinds = {
  nation: FavoriteShare<PlayerTankRow['vehicle']['nation']> | null;
  tankClass: FavoriteShare<PlayerTankRow['vehicle']['type']> | null;
};
