import type { ReplayFilters, ReplayItem, ReplaySort } from '../../model';
import type { FilterReplaysInput, MatchChoiceInput, MatchReplayInput } from './filter-replays.types';

import { REPLAY_FILTER } from '../../config';

export const DEFAULT_REPLAY_FILTERS: ReplayFilters = {
  query: '',
  result: null,
  map: null,
  vehicle: null,
  nation: null,
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

const matchesQuery = ({ item, filters }: MatchReplayInput): boolean => {
  const query = filters.query.trim().toLowerCase();

  return query === '' || haystack(item).includes(query);
};

const matchesChoice = <Value>({ chosen, actual }: MatchChoiceInput<Value>): boolean => chosen === null || actual === chosen;

const matchesFavourite = ({ item, filters }: MatchReplayInput): boolean => !filters.favourites || item.favourite;

export const matchesReplay = (input: MatchReplayInput): boolean => {
  const { item, filters } = input;

  const checks = [
    matchesQuery(input),
    matchesChoice({ chosen: filters.result, actual: item.result }),
    matchesChoice({ chosen: filters.map, actual: item.map }),
    matchesChoice({ chosen: filters.vehicle, actual: item.vehicle }),
    matchesChoice({ chosen: filters.nation, actual: item.nation }),
    matchesChoice({ chosen: filters.tier, actual: item.tier }),
    matchesChoice({ chosen: filters.type, actual: item.type }),
    matchesFavourite(input),
    withinPeriod(input)
  ];

  return checks.every(Boolean);
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
    filters.nation !== null,
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
