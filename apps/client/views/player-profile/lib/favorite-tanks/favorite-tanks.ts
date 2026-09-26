import type { PlayerTankRow } from '@bronevik/schemas';

import { sortBy, take } from 'remeda';

import type { FavoriteTanksInput } from './favorite-tanks.types';

export const favoriteTanks = ({ rows, count }: FavoriteTanksInput): PlayerTankRow[] =>
  take(
    sortBy(
      rows.filter(({ battles }) => battles > 0),
      [({ battles }) => battles, 'desc']
    ),
    Math.max(0, count)
  );
