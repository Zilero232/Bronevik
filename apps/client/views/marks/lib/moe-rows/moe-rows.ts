import type { MoeRow } from '@bronevik/schemas';

import type { FilterByNameInput } from './moe-rows.types';

const normalize = (value: string) => value.toLocaleLowerCase('ru').replaceAll(/[\s\-_.]/g, '');

export const filterByName = ({ rows, query }: FilterByNameInput): MoeRow[] => {
  const needle = normalize(query);

  if (!needle) {
    return rows;
  }

  return rows.filter(({ vehicle }) => [vehicle.name, vehicle.shortName, vehicle.slug].some((value) => normalize(value).includes(needle)));
};

export const latestUpdate = (rows: MoeRow[]): string | null =>
  rows.reduce<string | null>((latest, { updatedAt }) => (updatedAt && (!latest || updatedAt > latest) ? updatedAt : latest), null);
