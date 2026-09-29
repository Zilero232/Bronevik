import type { VehicleCatalogItem } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { groupBy, isIncludedIn, sortBy } from 'remeda';

import type { CatalogTierGroup, FilterCatalogInput, RankOfInput } from './catalog-filter.types';

const normalizeName = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replaceAll(/[\s\-_.«»"'()]/g, '');

const rankOf = ({ list, value }: RankOfInput) => {
  const index = list.indexOf(value);

  return index === -1 ? list.length : index;
};

export const filterCatalog = ({ catalog, filters: { tiers, types, nations, statuses, roles }, search }: FilterCatalogInput): VehicleCatalogItem[] => {
  const needle = normalizeName(search);

  return catalog.filter((vehicle) => {
    const { name, shortName, slug, tier, type, nation, status, role } = vehicle;
    const isNameMatch = needle.length === 0 || [name, shortName, slug].some((value) => normalizeName(value).includes(needle));
    const isTierMatch = tiers.length === 0 || tiers.includes(tier);
    const isTypeMatch = types.length === 0 || types.includes(type);
    const isNationMatch = nations.length === 0 || isIncludedIn(nation, nations);
    const isStatusMatch = statuses.length === 0 || statuses.includes(status);
    const isRoleMatch = roles.length === 0 || (role !== null && roles.includes(role));

    return isNameMatch && isTierMatch && isTypeMatch && isNationMatch && isStatusMatch && isRoleMatch;
  });
};

export const groupByTier = (vehicles: readonly VehicleCatalogItem[]): CatalogTierGroup[] =>
  sortBy(
    Object.values(groupBy(vehicles, ({ tier }) => tier)).map((group) => ({
      tier: group[0].tier,
      vehicles: sortBy(
        group,
        ({ type }) => rankOf({ list: TANK_CLASSES, value: type }),
        ({ nation }) => rankOf({ list: NATIONS, value: nation }),
        ({ isPremium }) => Number(isPremium),
        ({ shortName, name }) => shortName || name
      )
    })),
    [({ tier }) => tier, 'desc']
  );
