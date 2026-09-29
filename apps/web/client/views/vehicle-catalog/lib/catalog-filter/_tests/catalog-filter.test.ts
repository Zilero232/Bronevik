import type { VehicleCatalogItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { VehicleFilterValues } from '@/features/tank/filter-vehicles';

import { filterCatalog, groupByTier } from '../catalog-filter';

const vehicle = (overrides: Partial<VehicleCatalogItem> & Pick<VehicleCatalogItem, 'name' | 'tankId'>): VehicleCatalogItem => ({
  shortName: overrides.name,
  slug: overrides.name.toLowerCase().replaceAll(' ', '-'),
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null },
  role: null,
  isPreferential: false,
  ...overrides
});

const CATALOG = [
  vehicle({ tankId: 1, name: 'ИС-7', role: 'HT_break' }),
  vehicle({ tankId: 2, name: 'Т-34', type: 'mediumTank', tier: 5 }),
  vehicle({ tankId: 3, name: 'Löwe', nation: 'germany', tier: 8, isPremium: true, status: 'premium' }),
  vehicle({ tankId: 4, name: 'Объект 140', type: 'mediumTank' }),
  vehicle({ tankId: 5, name: 'Ёж', type: 'lightTank', tier: 5 }),
  vehicle({ tankId: 6, name: 'Коллекционный', tier: 8, isCollectible: true, status: 'collector' }),
  vehicle({ tankId: 7, name: 'Наградной', tier: 8, isPremium: true, status: 'reward' })
];

const NO_FILTERS: VehicleFilterValues = { tiers: [], types: [], nations: [], statuses: [], roles: [] };

const ids = (vehicles: VehicleCatalogItem[]) => vehicles.map(({ tankId }) => tankId);

describe('filterCatalog', () => {
  it('keeps everything without filters', () => {
    expect(ids(filterCatalog({ catalog: CATALOG, filters: NO_FILTERS, search: '' }))).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('matches names ignoring case, dashes, spaces and ё', () => {
    expect(ids(filterCatalog({ catalog: CATALOG, filters: NO_FILTERS, search: 'ис7' }))).toEqual([1]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: NO_FILTERS, search: 'объект 140' }))).toEqual([4]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: NO_FILTERS, search: 'еж' }))).toEqual([5]);
  });

  it('combines tier, type, nation and status filters', () => {
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, tiers: [5] }, search: '' }))).toEqual([2, 5]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, types: ['mediumTank'], tiers: [10] }, search: '' }))).toEqual([4]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, nations: ['germany'] }, search: '' }))).toEqual([3]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, statuses: ['premium'] }, search: '' }))).toEqual([3]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, statuses: ['researchable'] }, search: '' }))).toEqual([1, 2, 4, 5]);
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, statuses: ['collector', 'reward'] }, search: '' }))).toEqual([6, 7]);
  });

  it('keeps only vehicles of the chosen role', () => {
    expect(ids(filterCatalog({ catalog: CATALOG, filters: { ...NO_FILTERS, roles: ['HT_break'] }, search: '' }))).toEqual([1]);
  });
});

describe('groupByTier', () => {
  it('groups by tier from the highest and orders by class within a tier', () => {
    const groups = groupByTier(CATALOG);

    expect(groups.map(({ tier }) => tier)).toEqual([10, 8, 5]);
    expect(ids(groups[0]?.vehicles ?? [])).toEqual([4, 1]);
    expect(ids(groups[2]?.vehicles ?? [])).toEqual([5, 2]);
  });
});
