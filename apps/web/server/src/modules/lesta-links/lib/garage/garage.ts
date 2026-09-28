import type { GarageRow, GarageSplit } from './garage.types';

export const garageSplit = (rows: readonly GarageRow[]): GarageSplit | null => {
  const known = rows.filter((row) => typeof row.in_garage === 'boolean');

  if (known.length === 0) {
    return null;
  }

  return {
    inGarage: known.filter((row) => row.in_garage === true).map((row) => row.tank_id),
    sold: known.filter((row) => row.in_garage === false).map((row) => row.tank_id)
  };
};
