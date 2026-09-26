import type { GuideKind, GuideSort } from '@/shared/api/guides';

export type GuideFilters = {
  kind: GuideKind | null;
  tank: number | null;
  map: string | null;
  sort: GuideSort;
  page: number;
};

export type ToGuideListQueryInput = {
  filters: GuideFilters;
  pageSize: number;
};

export type PageCountInput = {
  total: number;
  pageSize: number;
};
