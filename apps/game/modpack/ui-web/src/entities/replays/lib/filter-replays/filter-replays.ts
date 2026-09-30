import type { ReplayFilters, ReplayItem, ReplaySort } from '../../model';
import type { FilterReplaysInput, MatchReplayInput } from './filter-replays.types';

import { REPLAY_FILTER } from '../../config';

export const DEFAULT_REPLAY_FILTERS: ReplayFilters = {
  query: '',
  result: null,
  map: null,
  vehicle: null,
  tier: null,
  type: null,
  period: REPLAY_FILTER.all,
  favourites: false,
  sort: REPLAY_FILTER.defaultSort,
  descending: true
};

const haystack = (item: ReplayItem): string =>
  [item.title, item.map_title, item.map, item.tank, item.vehicle].filter(Boolean).join(' ').toLowerCase();

const withinPeriod = ({ item, filters, now }: MatchReplayInput): boolean =>
  filters.period === REPLAY_FILTER.all || now - item.time <= REPLAY_FILTER.periodSeconds[filters.period];

export const matchesReplay = (input: MatchReplayInput): boolean => {
  const { item, filters } = input;
  const query = filters.query.trim().toLowerCase();

  return (
    (query === '' || haystack(item).includes(query)) &&
    (filters.result === null || item.result === filters.result) &&
    (filters.map === null || item.map === filters.map) &&
    (filters.vehicle === null || item.vehicle === filters.vehicle) &&
    (filters.tier === null || item.tier === filters.tier) &&
    (filters.type === null || item.type === filters.type) &&
    (!filters.favourites || item.favourite) &&
    withinPeriod(input)
  );
};

const sortValue = (item: ReplayItem, sort: ReplaySort): number | null => item[sort];

const compare = (sort: ReplaySort, descending: boolean) => (left: ReplayItem, right: ReplayItem) => {
  const a = sortValue(left, sort);
  const b = sortValue(right, sort);

  if (a === b) {
    return right.time - left.time;
  }

  if (a === null || b === null) {
    return a === null ? 1 : -1;
  }

  return descending ? b - a : a - b;
};

export const filterReplays = ({ items, filters, now }: FilterReplaysInput): ReplayItem[] =>
  items.filter((item) => matchesReplay({ item, filters, now })).sort(compare(filters.sort, filters.descending));

export const activeFilterCount = (filters: ReplayFilters): number =>
  [
    filters.query.trim() !== '',
    filters.result !== null,
    filters.map !== null,
    filters.vehicle !== null,
    filters.tier !== null,
    filters.type !== null,
    filters.period !== REPLAY_FILTER.all,
    filters.favourites
  ].filter(Boolean).length;

export const clearFilters = (filters: ReplayFilters): ReplayFilters => ({
  ...DEFAULT_REPLAY_FILTERS,
  sort: filters.sort,
  descending: filters.descending
});
