import type { PlayerTankRow } from '@otmetki/schemas';

import { firstBy, sumBy } from 'remeda';

import type { FavoriteKinds, FavoriteShare } from './favorite-kinds.types';

const topShare = <T>(rows: readonly PlayerTankRow[], key: (row: PlayerTankRow) => T): FavoriteShare<T> | null => {
  const total = sumBy(rows, ({ battles }) => battles);
  const totals = new Map<T, number>();

  rows.forEach((row) => totals.set(key(row), (totals.get(key(row)) ?? 0) + row.battles));

  const top = firstBy(
    [...totals].filter(([, battles]) => battles > 0),
    [([, battles]) => battles, 'desc']
  );

  return top && total > 0 ? { value: top[0], share: top[1] / total } : null;
};

export const favoriteKinds = (rows: readonly PlayerTankRow[]): FavoriteKinds => ({
  nation: topShare(rows, ({ vehicle }) => vehicle.nation),
  tankClass: topShare(rows, ({ vehicle }) => vehicle.type)
});
