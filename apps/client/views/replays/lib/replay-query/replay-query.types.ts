import type { REPLAY_RESULTS, REPLAY_SORTS } from '../../config';

export type ReplaySort = (typeof REPLAY_SORTS)[number];

export type ReplayResult = (typeof REPLAY_RESULTS)[number];

export type ReplayFilters = {
  tank: number | null;
  map: string | null;
  mode: string | null;
  player: string;
  result: ReplayResult | null;
  sort: ReplaySort;
  offset: number;
};

export type ToSearchQueryInput = {
  filters: ReplayFilters;
  limit: number;
};

export type PageWindowInput = {
  offset: number;
  limit: number;
  total: number;
};

export type PageWindow = {
  page: number;
  pages: number;
  prevOffset: number | null;
  nextOffset: number | null;
};
