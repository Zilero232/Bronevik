import { sortBy } from 'remeda';
import { match } from 'ts-pattern';

import type { RarityRanked, SortableAchievement, SortCatalogInput } from './catalog-sort.types';

export const byRarity = <T extends RarityRanked>(items: readonly T[]): T[] =>
  sortBy(
    items,
    (item) => item.share ?? Number.POSITIVE_INFINITY,
    (item) => item.name
  );

export const sortCatalog = <T extends SortableAchievement>({ items, sort }: SortCatalogInput<T>): T[] =>
  match(sort)
    .with('rarity', () => byRarity(items))
    .with('common', () => sortBy(items, [(item) => item.share ?? Number.NEGATIVE_INFINITY, 'desc'], (item) => item.name))
    .with('points', () => sortBy(items, [(item) => item.points ?? Number.NEGATIVE_INFINITY, 'desc'], (item) => item.name))
    .with('order', () =>
      sortBy(
        items,
        (item) => item.order ?? Number.MAX_SAFE_INTEGER,
        (item) => item.name
      )
    )
    .exhaustive();
