import type { VehicleCatalogItem } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { groupBy, isIncludedIn, sortBy } from 'remeda';

import { matchesKind, matchesRoles } from '@/features/tank/filter-vehicles';

import type { CatalogTierGroup, FilterCatalogInput } from './catalog-filter.types';

const normalizeName = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replaceAll(/[\s\-_.«»"'()]/g, '');

const rankOf = (list: readonly string[], value: string) => {
  const index = list.indexOf(value);

  return index === -1 ? list.length : index;
};

export const filterCatalog = ({ catalog, filters: { tiers, types, nations, premium, roles }, search }: FilterCatalogInput): VehicleCatalogItem[] => {
  const needle = normalizeName(search);

  return catalog.filter((vehicle) => {
    const { name, shortName, slug, tier, type, nation, role } = vehicle;
    const isNameMatch = needle.length === 0 || [name, shortName, slug].some((value) => normalizeName(value).includes(needle));
    const isTierMatch = tiers.length === 0 || tiers.includes(tier);
    const isTypeMatch = types.length === 0 || types.includes(type);
    const isNationMatch = nations.length === 0 || isIncludedIn(nation, nations);
    const isTraitMatch = matchesKind({ kind: premium, vehicle }) && matchesRoles({ role, roles });

    return isNameMatch && isTierMatch && isTypeMatch && isNationMatch && isTraitMatch;
  });
};

export const groupByTier = (vehicles: readonly VehicleCatalogItem[]): CatalogTierGroup[] =>
  sortBy(
    Object.values(groupBy(vehicles, ({ tier }) => tier)).map((group) => ({
      tier: group[0].tier,
      vehicles: sortBy(
        group,
        ({ type }) => rankOf(TANK_CLASSES, type),
        ({ nation }) => rankOf(NATIONS, nation),
        ({ isPremium }) => Number(isPremium),
        ({ shortName, name }) => shortName || name
      )
    })),
    [({ tier }) => tier, 'desc']
  );
