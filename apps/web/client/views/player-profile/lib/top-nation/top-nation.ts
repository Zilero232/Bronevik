import type { PlayerTankRow } from '@otmetki/schemas';

import { firstBy } from 'remeda';

import type { TankNation } from './top-nation.types';

export const topNation = (rows: readonly PlayerTankRow[]): TankNation | null => {
  const totals = new Map<TankNation, number>();

  rows.forEach(({ vehicle, battles }) => totals.set(vehicle.nation, (totals.get(vehicle.nation) ?? 0) + battles));

  const top = firstBy(
    [...totals].filter(([, battles]) => battles > 0),
    [([, battles]) => battles, 'desc']
  );

  return top?.[0] ?? null;
};
