import type { GuideListQuery } from '@/shared/api/guides';

import type { GuideFilters, PageCountInput, ToGuideListQueryInput } from './guide-filters.types';

export const toGuideListQuery = ({ filters, pageSize }: ToGuideListQueryInput): GuideListQuery => ({
  sort: filters.sort,
  limit: pageSize,
  offset: (Math.max(1, Math.trunc(filters.page)) - 1) * pageSize,
  ...(filters.kind === null ? {} : { kind: filters.kind }),
  ...(filters.tank === null ? {} : { tankId: filters.tank }),
  ...(filters.map === null || filters.map === '' ? {} : { arenaId: filters.map })
});

export const pageCount = ({ total, pageSize }: PageCountInput): number => Math.max(1, Math.ceil(total / pageSize));

export const hasActiveFilters = (filters: GuideFilters): boolean => filters.kind !== null || filters.tank !== null || filters.map !== null;
